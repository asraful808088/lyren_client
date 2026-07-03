using Microsoft.EntityFrameworkCore;
using Sql.Models;
using Eservice.RedisServices;
using Sql.Utils;

namespace Sql.Services
{
    public interface IProductService
    {
        Task<ProductResponse> CreateProductAsync(CreateProductRequest request);
        Task<ProductResponse?> UpdateProductAsync(int id, UpdateProductRequest request);
        Task<ProductResponse?> GetProductByIdAsync(int id);
        Task<PaginatedResponse<ProductResponse>> GetAllProductsAsync(int page = 1, int pageSize = 12);
        Task<PaginatedResponse<ProductResponse>> SearchProductsAsync(string query, int page = 1, int pageSize = 12);
        Task<PaginatedResponse<ProductResponse>> GetProductsByCategoryAsync(string category, int page = 1, int pageSize = 12);
        Task<PaginatedResponse<ProductResponse>> GetProductsByCollectionAsync(string collection, int page = 1, int pageSize = 12);
        Task<bool> DeleteProductAsync(int id);
        Task<List<ReviewDto>> GetProductReviewsAsync(int productId);
        Task<ReviewDto> AddReviewAsync(int productId, ReviewDto reviewDto);
    }

    public class ProductService : IProductService
    {
        private readonly ProductContext _context;
        private readonly server.ICloudinaryService _cloudinary;
        private readonly IRedisProductService _redisService;
        private readonly ILogger<ProductService> _logger;

        public ProductService(
            ProductContext context, 
            server.ICloudinaryService cloudinary,
            IRedisProductService redisService,
            ILogger<ProductService> logger)
        {
            _context = context;
            _cloudinary = cloudinary;
            _redisService = redisService;
            _logger = logger;
        }

        // ── Upload image to Cloudinary and return URL ────────────────────────────
        private async Task<string> UploadImageAndGetUrlAsync(string imageData, string folder = "products")
        {
            if (imageData.StartsWith("http://") || imageData.StartsWith("https://"))
                return imageData;

            if (imageData.StartsWith("data:image") || IsBase64(imageData))
            {
                var base64Data = imageData.Contains(",") ? imageData.Split(',')[1] : imageData;
                var bytes = Convert.FromBase64String(base64Data);
                using var stream = new MemoryStream(bytes);
                var result = await _cloudinary.UploadImageFromStreamAsync(stream, "product.jpg", folder: folder);
                return result.Success ? result.SecureUrl! : imageData;
            }

            if (File.Exists(imageData))
            {
                var result = await _cloudinary.UploadImageAsync(imageData, folder: folder);
                return result.Success ? result.SecureUrl! : imageData;
            }

            return imageData;
        }

        private static bool IsBase64(string s)
        {
            try { Convert.FromBase64String(s); return s.Length % 4 == 0; }
            catch { return false; }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // CREATE PRODUCT → SQL + Redis
        // ────────────────────────────────────────────────────────────────────────────
        public async Task<ProductResponse> CreateProductAsync(CreateProductRequest request)
        {
            try
            {
                var product = new Product
                {
                    Name         = request.Name,
                    Count        = request.Count,
                    MiniDesc     = request.MiniDesc,
                    Description  = request.Description,
                    CareDetails  = request.CareDetails,
                    Price        = request.Price,
                    Discount     = request.Discount,
                    InjectorUser = request.InjectorUser,
                    CreateTime   = DateTime.UtcNow,
                    UpdateTime   = DateTime.UtcNow,
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();

                if (!string.IsNullOrEmpty(request.Category))
                {
                    _context.ProductCategories.Add(new ProductCategory
                    {
                        ProductId  = product.Id,
                        Type       = request.Category,
                        CreateTime = DateTime.UtcNow,
                        UpdateTime = DateTime.UtcNow,
                    });
                }

                if (!string.IsNullOrEmpty(request.Collection))
                {
                    _context.ProductCollections.Add(new ProductCollection
                    {
                        ProductId  = product.Id,
                        Collection = request.Collection,
                        CreateTime = DateTime.UtcNow,
                        UpdateTime = DateTime.UtcNow,
                    });
                }

                if (request.Colors?.Count > 0)
                {
                    _context.ProductColors.AddRange(request.Colors.Select(c => new ProductColor
                    {
                        ProductId  = product.Id,
                        ColorName  = c.ColorName,
                        ColorCode  = c.ColorCode,
                        CreateTime = DateTime.UtcNow,
                        UpdateTime = DateTime.UtcNow,
                    }));
                }

                if (request.Sizes?.Count > 0)
                {
                    _context.ProductSizes.AddRange(request.Sizes.Select(s => new ProductSize
                    {
                        ProductId  = product.Id,
                        Size       = s,
                        CreateTime = DateTime.UtcNow,
                        UpdateTime = DateTime.UtcNow,
                    }));
                }

                if (request.Images?.Count > 0)
                {
                    var imageEntities = new List<ProductImage>();
                    foreach (var img in request.Images)
                    {
                        var imageUrl = await UploadImageAndGetUrlAsync(img.Image, folder: $"products/{product.Id}");
                        imageEntities.Add(new ProductImage
                        {
                            ProductId  = product.Id,
                            Image      = imageUrl,
                            Type       = img.Type,
                            CreateTime = DateTime.UtcNow,
                            UpdateTime = DateTime.UtcNow,
                        });
                    }
                    _context.ProductImages.AddRange(imageEntities);
                }

                await _context.SaveChangesAsync();
                
                // ✅ Cache the product in Redis
                var response = MapToResponse(product);
                await _redisService.CacheProductAsync(response);
                
                _logger.LogInformation($"✅ Product created & cached: {product.Name} (ID: {IdEncoder.Encode(product.Id)})");
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error creating product: {ex.Message}");
                throw;
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // UPDATE PRODUCT → SQL + Redis
        // ────────────────────────────────────────────────────────────────────────────
        public async Task<ProductResponse?> UpdateProductAsync(int id, UpdateProductRequest request)
        {
            try
            {
                var product = await _context.Products
                    .Include(p => p.Categories)
                    .Include(p => p.Collections)
                    .Include(p => p.Colors)
                    .Include(p => p.Sizes)
                    .Include(p => p.Images)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null) return null;

                if (!string.IsNullOrEmpty(request.Name))        product.Name        = request.Name;
                if (request.Count.HasValue)                      product.Count       = request.Count.Value;
                if (!string.IsNullOrEmpty(request.MiniDesc))    product.MiniDesc    = request.MiniDesc;
                if (!string.IsNullOrEmpty(request.Description)) product.Description = request.Description;
                if (!string.IsNullOrEmpty(request.CareDetails)) product.CareDetails = request.CareDetails;
                if (request.Price.HasValue)                      product.Price       = request.Price.Value;
                if (request.Discount.HasValue)                   product.Discount    = request.Discount.Value;
                if (!string.IsNullOrEmpty(request.InjectorUser)) product.InjectorUser = request.InjectorUser;
                product.UpdateTime = DateTime.UtcNow;

                if (!string.IsNullOrEmpty(request.Category))
                {
                    var existing = await _context.ProductCategories.FirstOrDefaultAsync(c => c.ProductId == id);
                    if (existing != null) { existing.Type = request.Category; existing.UpdateTime = DateTime.UtcNow; }
                    else _context.ProductCategories.Add(new ProductCategory { ProductId = id, Type = request.Category, CreateTime = DateTime.UtcNow, UpdateTime = DateTime.UtcNow });
                }

                if (!string.IsNullOrEmpty(request.Collection))
                {
                    var existing = await _context.ProductCollections.FirstOrDefaultAsync(c => c.ProductId == id);
                    if (existing != null) { existing.Collection = request.Collection; existing.UpdateTime = DateTime.UtcNow; }
                    else _context.ProductCollections.Add(new ProductCollection { ProductId = id, Collection = request.Collection, CreateTime = DateTime.UtcNow, UpdateTime = DateTime.UtcNow });
                }

                if (request.Colors != null)
                {
                    _context.ProductColors.RemoveRange(await _context.ProductColors.Where(c => c.ProductId == id).ToListAsync());
                    _context.ProductColors.AddRange(request.Colors.Select(c => new ProductColor
                    {
                        ProductId = id, ColorName = c.ColorName, ColorCode = c.ColorCode,
                        CreateTime = DateTime.UtcNow, UpdateTime = DateTime.UtcNow,
                    }));
                }

                if (request.Sizes != null)
                {
                    _context.ProductSizes.RemoveRange(await _context.ProductSizes.Where(s => s.ProductId == id).ToListAsync());
                    _context.ProductSizes.AddRange(request.Sizes.Select(s => new ProductSize
                    {
                        ProductId = id, Size = s, CreateTime = DateTime.UtcNow, UpdateTime = DateTime.UtcNow,
                    }));
                }

                if (request.Images != null)
                {
                    var existingImages = await _context.ProductImages.Where(i => i.ProductId == id).ToListAsync();

                    foreach (var old in existingImages)
                    {
                        if (old.Image.Contains("cloudinary.com"))
                        {
                            var uri = new Uri(old.Image);
                            var segments = uri.AbsolutePath.Split('/');
                            var uploadIndex = Array.IndexOf(segments, "upload");
                            if (uploadIndex >= 0 && uploadIndex < segments.Length - 1)
                            {
                                var publicIdWithExt = string.Join("/", segments[(uploadIndex + 1)..]);
                                var publicId = Path.GetFileNameWithoutExtension(publicIdWithExt);
                                var folder   = Path.GetDirectoryName(publicIdWithExt)?.Replace("\\", "/");
                                var fullPublicId = string.IsNullOrEmpty(folder) ? publicId : $"{folder}/{publicId}";
                                await _cloudinary.DeleteAsync(fullPublicId);
                            }
                        }
                    }

                    _context.ProductImages.RemoveRange(existingImages);

                    var newImages = new List<ProductImage>();
                    foreach (var img in request.Images)
                    {
                        var imageUrl = await UploadImageAndGetUrlAsync(img.Image, folder: $"products/{id}");
                        newImages.Add(new ProductImage
                        {
                            ProductId  = id,
                            Image      = imageUrl,
                            Type       = img.Type,
                            CreateTime = DateTime.UtcNow,
                            UpdateTime = DateTime.UtcNow,
                        });
                    }
                    _context.ProductImages.AddRange(newImages);
                }

                await _context.SaveChangesAsync();

                var updated = await _context.Products
                    .Include(p => p.Categories).Include(p => p.Collections)
                    .Include(p => p.Colors).Include(p => p.Sizes)
                    .Include(p => p.Images).Include(p => p.Reviews)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (updated != null)
                {
                    // ✅ Invalidate & update Redis cache
                    await _redisService.InvalidateProductCacheAsync(id);
                    var response = MapToResponse(updated);
                    await _redisService.CacheProductAsync(response);
                    
                    _logger.LogInformation($"✅ Product updated & cache refreshed: {updated.Name} (ID: {IdEncoder.Encode(id)})");
                    return response;
                }

                return null;
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error updating product: {ex.Message}");
                throw;
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // DELETE PRODUCT → SQL + Redis
        // ────────────────────────────────────────────────────────────────────────────
        public async Task<bool> DeleteProductAsync(int id)
        {
            try
            {
                var product = await _context.Products.FindAsync(id);
                if (product == null) return false;

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();

                // ✅ Delete from Redis cache
                await _redisService.InvalidateProductCacheAsync(id);

                _logger.LogInformation($"✅ Product deleted & cache cleared: ID {IdEncoder.Encode(id)}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error deleting product: {ex.Message}");
                throw;
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // GET PRODUCT → Redis First, then SQL
        // ────────────────────────────────────────────────────────────────────────────
        public async Task<ProductResponse?> GetProductByIdAsync(int id)
        {
            try
            {
                // 🔴 Check Redis first (fast)
                var cachedProduct = await _redisService.GetProductFromCacheAsync(id);
                if (cachedProduct != null)
                {
                    _logger.LogDebug($"✅ Product found in cache: {IdEncoder.Encode(id)}");
                    return cachedProduct;
                }

                // 🔵 If not in cache, fetch from SQL
                _logger.LogDebug($"⚠️  Cache miss, fetching from SQL: {IdEncoder.Encode(id)}");
                var product = await _context.Products
                    .Include(p => p.Categories).Include(p => p.Collections)
                    .Include(p => p.Colors).Include(p => p.Sizes)
                    .Include(p => p.Images).Include(p => p.Reviews)
                    .FirstOrDefaultAsync(p => p.Id == id);

                if (product == null) return null;

                // 💾 Cache it for next time
                var response = MapToResponse(product);
                await _redisService.CacheProductAsync(response);
                
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error fetching product: {ex.Message}");
                return null;
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // GET ALL PRODUCTS
        // ────────────────────────────────────────────────────────────────────────────
        public async Task<PaginatedResponse<ProductResponse>> GetAllProductsAsync(int page = 1, int pageSize = 12)
        {
            try
            {
                var query = _context.Products
                    .Include(p => p.Categories).Include(p => p.Collections)
                    .Include(p => p.Colors).Include(p => p.Sizes)
                    .Include(p => p.Images).Include(p => p.Reviews);

                var total    = await query.CountAsync();
                var products = await query.OrderByDescending(p => p.CreateTime)
                    .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

                var responses = products.Select(MapToResponse).ToList();
                
                // 💾 Cache individual products
                await _redisService.CacheProductsAsync(responses);

                return new PaginatedResponse<ProductResponse>
                {
                    Data = responses,
                    Total = total, 
                    Page = page, 
                    PageSize = pageSize,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error fetching all products: {ex.Message}");
                throw;
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // SEARCH PRODUCTS
        // ────────────────────────────────────────────────────────────────────────────
        public async Task<PaginatedResponse<ProductResponse>> SearchProductsAsync(
            string query, int page = 1, int pageSize = 12)
        {
            try
            {
                var q_lower = query.ToLower();

                var q = _context.Products
                    .Include(p => p.Categories).Include(p => p.Collections)
                    .Include(p => p.Colors).Include(p => p.Sizes)
                    .Include(p => p.Images).Include(p => p.Reviews)
                    .Where(p =>
                        p.Name.ToLower().Contains(q_lower) ||
                        p.Description.ToLower().Contains(q_lower) ||
                        p.MiniDesc.ToLower().Contains(q_lower) ||
                        p.Categories.Any(c => c.Type.ToLower().Contains(q_lower)) ||
                        p.Collections.Any(c => c.Collection.ToLower().Contains(q_lower))
                    );

                var total    = await q.CountAsync();
                var products = await q
                    .OrderByDescending(p => p.Name.ToLower().StartsWith(q_lower)) 
                    .ThenByDescending(p => p.CreateTime)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var responses = products.Select(MapToResponse).ToList();
                
                // 💾 Cache search results
                await _redisService.CacheSearchResultsAsync(query, responses);

                return new PaginatedResponse<ProductResponse>
                {
                    Data = responses,
                    Total = total, 
                    Page = page, 
                    PageSize = pageSize,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error searching products: {ex.Message}");
                throw;
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // GET PRODUCTS BY CATEGORY
        // ────────────────────────────────────────────────────────────────────────────
        public async Task<PaginatedResponse<ProductResponse>> GetProductsByCategoryAsync(
            string category, int page = 1, int pageSize = 12)
        {
            try
            {
                var q = _context.Products
                    .Include(p => p.Categories).Include(p => p.Collections)
                    .Include(p => p.Colors).Include(p => p.Sizes)
                    .Include(p => p.Images).Include(p => p.Reviews)
                    .Where(p => p.Categories.Any(c => c.Type == category));

                var total    = await q.CountAsync();
                var products = await q.OrderByDescending(p => p.CreateTime)
                    .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

                var responses = products.Select(MapToResponse).ToList();
                
                // 💾 Cache category results
                await _redisService.CacheCategoryProductsAsync(category, responses);

                return new PaginatedResponse<ProductResponse>
                {
                    Data = responses,
                    Total = total, 
                    Page = page, 
                    PageSize = pageSize,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error fetching products by category: {ex.Message}");
                throw;
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // GET PRODUCTS BY COLLECTION
        // ────────────────────────────────────────────────────────────────────────────
        public async Task<PaginatedResponse<ProductResponse>> GetProductsByCollectionAsync(
            string collection, int page = 1, int pageSize = 12)
        {
            try
            {
                var q = _context.Products
                    .Include(p => p.Categories).Include(p => p.Collections)
                    .Include(p => p.Colors).Include(p => p.Sizes)
                    .Include(p => p.Images).Include(p => p.Reviews)
                    .Where(p => p.Collections.Any(c => c.Collection == collection));

                var total    = await q.CountAsync();
                var products = await q.OrderByDescending(p => p.CreateTime)
                    .Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

                var responses = products.Select(MapToResponse).ToList();
                
                // 💾 Cache collection results
                await _redisService.CacheCollectionProductsAsync(collection, responses);

                return new PaginatedResponse<ProductResponse>
                {
                    Data = responses,
                    Total = total, 
                    Page = page, 
                    PageSize = pageSize,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error fetching products by collection: {ex.Message}");
                throw;
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // REVIEWS
        // ────────────────────────────────────────────────────────────────────────────
        public async Task<List<ReviewDto>> GetProductReviewsAsync(int productId)
        {
            try
            {
                var reviews = await _context.Reviews
                    .Where(r => r.ProductId == productId)
                    .OrderByDescending(r => r.CreateTime).ToListAsync();

                return reviews.Select(r => new ReviewDto
                {
                    Id = r.Id, 
                    Username = r.Username, 
                    Rating = r.Rating,
                    Comment = r.Comment, 
                    React = r.React, 
                    CreateTime = r.CreateTime,
                }).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error fetching reviews: {ex.Message}");
                throw;
            }
        }

        public async Task<ReviewDto> AddReviewAsync(int productId, ReviewDto reviewDto)
        {
            try
            {
                var review = new Review
                {
                    ProductId  = productId,
                    Username   = reviewDto.Username,
                    Rating     = reviewDto.Rating,
                    Comment    = reviewDto.Comment,
                    React      = 0,
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow,
                };
                _context.Reviews.Add(review);
                await _context.SaveChangesAsync();

                // ✅ Invalidate product cache (reviews changed)
                await _redisService.InvalidateProductCacheAsync(productId);

                return new ReviewDto
                {
                    Id = review.Id, 
                    Username = review.Username, 
                    Rating = review.Rating,
                    Comment = review.Comment, 
                    React = review.React, 
                    CreateTime = review.CreateTime,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error adding review: {ex.Message}");
                throw;
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // MAPPING
        // ────────────────────────────────────────────────────────────────────────────
        private ProductResponse MapToResponse(Product product)
        {
            return new ProductResponse
            {
                Id           = product.Id,
                Name         = product.Name,
                Count        = product.Count,
                MiniDesc     = product.MiniDesc,
                Description  = product.Description,
                CareDetails  = product.CareDetails,
                Price        = product.Price,
                Discount     = product.Discount,
                InjectorUser = product.InjectorUser,
                Category     = product.Categories?.FirstOrDefault()?.Type,
                Collection   = product.Collections?.FirstOrDefault()?.Collection,
                CreateTime   = product.CreateTime,
                UpdateTime   = product.UpdateTime,
                Colors = product.Colors?.Select(c => new ColorDto
                {
                    Id = c.Id, ColorName = c.ColorName, ColorCode = c.ColorCode,
                }).ToList() ?? new(),
                Sizes  = product.Sizes?.Select(s => s.Size).ToList() ?? new(),
                Images = product.Images?.Select(i => new ImageDto
                {
                    Id = i.Id, Image = i.Image, Type = i.Type,
                }).ToList() ?? new(),
                AverageRating = product.Reviews?.Any() == true ? product.Reviews.Average(r => r.Rating) : 0,
                ReviewCount   = product.Reviews?.Count ?? 0,
            };
        }
    }
}
