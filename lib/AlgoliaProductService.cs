using Algolia.Search.Clients;
using Algolia.Search.Models.Search;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Sql.Models;
using Sql.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sql.Services
{
    public interface IAlgoliaProductService
    {
        /// <summary>Admin: wipe Algolia index and re-index every product from SQL.</summary>
        Task<int> BulkIndexFromSqlAsync();

        /// <summary>Upsert a single product into Algolia (call after create/update).</summary>
        Task IndexProductAsync(int productId);

        /// <summary>Remove a product from Algolia (call after delete).</summary>
        Task DeleteProductAsync(int productId);

        /// <summary>Partial-update only the stock count (call after a purchase).</summary>
        Task UpdateStockAsync(int productId, int newCount);

        /// <summary>Full-text search powered by Algolia.</summary>
        Task<AlgoliaSearchResult> SearchAsync(string query, int page = 1, int pageSize = 12,
                                              string? category = null, string? collection = null);

        /// <summary>Fetch a single product by its encoded (public) ID.</summary>
        Task<AlgoliaProduct?> GetByEncodedIdAsync(string encodedId);

        /// <summary>Configure Algolia index settings (searchable attrs, facets, ranking).</summary>
        Task ConfigureIndexAsync();
    }

    public class AlgoliaProductService : IAlgoliaProductService
    {
        private readonly SearchClient   _algolia;
        private readonly ProductContext _context;
        private readonly ILogger<AlgoliaProductService> _logger;

        private const string IndexName = "products";

        public AlgoliaProductService(
            SearchClient algolia,
            ProductContext context,
            ILogger<AlgoliaProductService> logger)
        {
            _algolia = algolia;
            _context = context;
            _logger  = logger;
        }

        // ── Map EF Product entity → Algolia document ────────────────────────────

        private static AlgoliaProduct ToAlgoliaDoc(Product p)
        {
            var thumbnail = p.Images?
                .FirstOrDefault(i => i.Type?.ToLower() == "main")?.Image
                ?? p.Images?.FirstOrDefault()?.Image;

            return new AlgoliaProduct
            {
                ObjectID      = IdEncoder.Encode(p.Id),
                RawId         = p.Id,
                Name          = p.Name          ?? "",
                MiniDesc      = p.MiniDesc       ?? "",
                Description   = p.Description    ?? "",
                CareDetails   = p.CareDetails    ?? "",
                Price         = p.Price,
                Discount      = p.Discount,
                Count         = p.Count,
                Category      = p.Categories?.FirstOrDefault()?.Type,
                Collection    = p.Collections?.FirstOrDefault()?.Collection,
                ThumbnailUrl  = thumbnail,
                AverageRating = p.Reviews?.Any() == true
                                    ? Math.Round(p.Reviews.Average(r => r.Rating), 2)
                                    : 0,
                ReviewCount   = p.Reviews?.Count ?? 0,
                Sizes         = p.Sizes?.Select(s => s.Size).ToList()       ?? new(),
                Colors        = p.Colors?.Select(c => c.ColorName).ToList() ?? new(),
                CreatedAt     = new DateTimeOffset(p.CreateTime).ToUnixTimeSeconds(),
                UpdatedAt     = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
            };
        }

        // ── Load all products from SQL and send to Algolia in batches ────────────

        public async Task<int> BulkIndexFromSqlAsync()
        {
            _logger.LogInformation("🔄 Starting bulk Algolia index from SQL...");

            var products = await _context.Products
                .Include(p => p.Categories)
                .Include(p => p.Collections)
                .Include(p => p.Colors)
                .Include(p => p.Sizes)
                .Include(p => p.Images)
                .Include(p => p.Reviews)
                .AsNoTracking()
                .ToListAsync();

            if (products.Count == 0)
            {
                _logger.LogWarning("⚠️  No products found in SQL — nothing indexed");
                return 0;
            }

            var docs  = products.Select(ToAlgoliaDoc).ToList();

            // Use correct API: GetIndex instead of InitIndex
            var index = _algolia.GetIndex(IndexName);

            const int chunkSize = 1000;
            int processed = 0;

            for (int i = 0; i < docs.Count; i += chunkSize)
            {
                var batch = docs.Skip(i).Take(chunkSize).ToList();
                await index.SaveObjectsAsync(batch);
                processed += batch.Count;
                _logger.LogInformation($"  📦 Indexed {processed}/{docs.Count} products");
            }

            _logger.LogInformation($"✅ Bulk index complete — {docs.Count} products in Algolia");
            return docs.Count;
        }

        // ── Upsert single product ────────────────────────────────────────────────

        public async Task IndexProductAsync(int productId)
        {
            var product = await _context.Products
                .Include(p => p.Categories)
                .Include(p => p.Collections)
                .Include(p => p.Colors)
                .Include(p => p.Sizes)
                .Include(p => p.Images)
                .Include(p => p.Reviews)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null)
            {
                _logger.LogWarning($"⚠️  Product {productId} not found in SQL — skipping Algolia sync");
                return;
            }

            var index = _algolia.GetIndex(IndexName);
            await index.SaveObjectAsync(ToAlgoliaDoc(product));
            _logger.LogInformation($"✅ Algolia synced product {productId} (objectID: {IdEncoder.Encode(productId)})");
        }

        // ── Delete single product ────────────────────────────────────────────────

        public async Task DeleteProductAsync(int productId)
        {
            var encodedId = IdEncoder.Encode(productId);
            var index     = _algolia.GetIndex(IndexName);
            await index.DeleteObjectAsync(encodedId);
            _logger.LogInformation($"🗑️  Algolia deleted product {productId} (objectID: {encodedId})");
        }

        // ── Partial stock update ─────────────────────────────────────────────────

        public async Task UpdateStockAsync(int productId, int newCount)
        {
            var encodedId = IdEncoder.Encode(productId);
            var index     = _algolia.GetIndex(IndexName);

            await index.PartialUpdateObjectAsync(new Dictionary<string, object>
            {
                ["objectID"]  = encodedId,
                ["Count"]     = newCount,
                ["UpdatedAt"] = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
            });

            _logger.LogInformation($"📦 Algolia stock updated — product {productId} → count {newCount}");
        }

        // ── Search with filters ──────────────────────────────────────────────────

        public async Task<AlgoliaSearchResult> SearchAsync(
            string query,
            int    page       = 1,
            int    pageSize   = 12,
            string? category   = null,
            string? collection = null)
        {
            var index = _algolia.GetIndex(IndexName);

            var filters = new List<string>();
            if (!string.IsNullOrWhiteSpace(category))
                filters.Add($"Category:\"{category}\"");
            if (!string.IsNullOrWhiteSpace(collection))
                filters.Add($"Collection:\"{collection}\"");

            var searchParams = new SearchParamsObject
            {
                Query = query,
                Page = page - 1,
                HitsPerPage = pageSize,
                Filters = filters.Count > 0 ? string.Join(" AND ", filters) : null,
            };

            var result = await index.SearchAsync<AlgoliaProduct>(searchParams);

            return new AlgoliaSearchResult
            {
                Hits       = result.Hits,
                TotalHits  = (int)(result.NbHits  ?? 0),
                Page       = page,
                PageSize   = pageSize,
                TotalPages = (int)(result.NbPages ?? 0),
                Query      = query,
            };
        }

        // ── Fetch single product by encoded ID ────────────────────────────────────

        public async Task<AlgoliaProduct?> GetByEncodedIdAsync(string encodedId)
        {
            if (!IdEncoder.TryDecode(encodedId, out _))
            {
                _logger.LogWarning($"⚠️  Invalid encoded product ID: {encodedId}");
                return null;
            }

            try
            {
                var index = _algolia.GetIndex(IndexName);
                return await index.GetObjectAsync<AlgoliaProduct>(encodedId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Algolia GetObject failed for {encodedId}: {ex.Message}");
                return null;
            }
        }

        // ── Configure index settings ─────────────────────────────────────────────

        public async Task ConfigureIndexAsync()
        {
            var index = _algolia.GetIndex(IndexName);

            await index.SetSettingsAsync(new IndexSettings
            {
                SearchableAttributes = new List<string>
                {
                    "Name",
                    "MiniDesc",
                    "Description",
                    "Category",
                    "Collection",
                    "Colors",
                    "Sizes",
                },

                AttributesForFaceting = new List<string>
                {
                    "filterOnly(Category)",
                    "filterOnly(Collection)",
                    "filterOnly(Sizes)",
                    "filterOnly(Colors)",
                    "filterOnly(Count)",
                },

                CustomRanking = new List<string>
                {
                    "desc(AverageRating)",
                    "desc(ReviewCount)",
                    "desc(UpdatedAt)",
                },

                MinWordSizefor1Typo  = 4,
                MinWordSizefor2Typos = 8,
            });

            _logger.LogInformation("✅ Algolia index settings configured");
        }
    }
}