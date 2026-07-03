using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Eservice.RedisServices;
using Sql.Utils;

namespace Sql.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CacheController : ControllerBase
    {
        private readonly IRedisProductService _redisService;
        private readonly ILogger<CacheController> _logger;

        public CacheController(IRedisProductService redisService, ILogger<CacheController> logger)
        {
            _redisService = redisService;
            _logger = logger;
        }

        // ────────────────────────────────────────────────────────────────────────────
        // GET: api/cache/stats
        // ────────────────────────────────────────────────────────────────────────────
        [HttpGet("stats")]
        public async Task<IActionResult> GetCacheStats()
        {
            try
            {
                var stats = await _redisService.GetCacheStatsAsync();
                return Ok(new
                {
                    success = true,
                    message = "Cache statistics retrieved",
                    data = stats
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error getting cache stats: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to retrieve cache statistics"
                });
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // GET: api/cache/product/{productId}/status
        // ────────────────────────────────────────────────────────────────────────────
        [HttpGet("product/{productId:int}/status")]
        public async Task<IActionResult> GetProductCacheStatus(int productId)
        {
            try
            {
                var exists = await _redisService.ProductExistsInCacheAsync(productId);
                var encodedId = IdEncoder.Encode(productId);

                return Ok(new
                {
                    success = true,
                    productId,
                    encodedId,
                    cachedInRedis = exists,
                    status = exists ? "✅ Cached" : "❌ Not cached",
                    message = exists 
                        ? $"Product {encodedId} is in cache" 
                        : $"Product {encodedId} is not cached"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error checking cache status: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to check cache status"
                });
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // DELETE: api/cache/product/{productId}/clear
        // (Admin only)
        // ────────────────────────────────────────────────────────────────────────────
        [Authorize(Roles = "Admin")]
        [HttpDelete("product/{productId:int}/clear")]
        public async Task<IActionResult> ClearProductCache(int productId)
        {
            try
            {
                var encodedId = IdEncoder.Encode(productId);
                await _redisService.InvalidateProductCacheAsync(productId);

                _logger.LogInformation($"✅ Cache cleared for product {productId}");

                return Ok(new
                {
                    success = true,
                    productId,
                    encodedId,
                    message = $"Cache cleared for product {encodedId}"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error clearing product cache: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to clear product cache"
                });
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // DELETE: api/cache/product/batch/clear
        // (Admin only)
        // ────────────────────────────────────────────────────────────────────────────
        [Authorize(Roles = "Admin")]
        [HttpDelete("product/batch/clear")]
        public async Task<IActionResult> ClearProductsBatchCache([FromBody] List<int> productIds)
        {
            try
            {
                if (productIds == null || productIds.Count == 0)
                    return BadRequest(new
                    {
                        success = false,
                        message = "Product IDs list is required"
                    });

                await _redisService.DeleteProductsCacheAsync(productIds);

                _logger.LogInformation($"✅ Cache cleared for {productIds.Count} products");

                var encodedIds = productIds.Select(id => new
                {
                    productId = id,
                    encodedId = IdEncoder.Encode(id)
                }).ToList();

                return Ok(new
                {
                    success = true,
                    count = productIds.Count,
                    products = encodedIds,
                    message = $"Cache cleared for {productIds.Count} products"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error clearing batch cache: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to clear batch cache"
                });
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // DELETE: api/cache/search/clear
        // (Admin only)
        // ────────────────────────────────────────────────────────────────────────────
        [Authorize(Roles = "Admin")]
        [HttpDelete("search/{query}/clear")]
        public async Task<IActionResult> ClearSearchCache(string query)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(query))
                    return BadRequest(new
                    {
                        success = false,
                        message = "Search query is required"
                    });

                await _redisService.InvalidateSearchCacheAsync(query);

                _logger.LogInformation($"✅ Search cache cleared for: {query}");

                return Ok(new
                {
                    success = true,
                    query,
                    message = $"Search cache cleared for '{query}'"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error clearing search cache: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to clear search cache"
                });
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // DELETE: api/cache/category/{category}/clear
        // (Admin only)
        // ────────────────────────────────────────────────────────────────────────────
        [Authorize(Roles = "Admin")]
        [HttpDelete("category/{category}/clear")]
        public async Task<IActionResult> ClearCategoryCache(string category)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(category))
                    return BadRequest(new
                    {
                        success = false,
                        message = "Category name is required"
                    });

                await _redisService.InvalidateCategoryCacheAsync(category);

                _logger.LogInformation($"✅ Category cache cleared for: {category}");

                return Ok(new
                {
                    success = true,
                    category,
                    message = $"Category cache cleared for '{category}'"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error clearing category cache: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to clear category cache"
                });
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // DELETE: api/cache/collection/{collection}/clear
        // (Admin only)
        // ────────────────────────────────────────────────────────────────────────────
        [Authorize(Roles = "Admin")]
        [HttpDelete("collection/{collection}/clear")]
        public async Task<IActionResult> ClearCollectionCache(string collection)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(collection))
                    return BadRequest(new
                    {
                        success = false,
                        message = "Collection name is required"
                    });

                await _redisService.InvalidateCollectionCacheAsync(collection);

                _logger.LogInformation($"✅ Collection cache cleared for: {collection}");

                return Ok(new
                {
                    success = true,
                    collection,
                    message = $"Collection cache cleared for '{collection}'"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error clearing collection cache: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to clear collection cache"
                });
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // GET: api/cache/health
        // ────────────────────────────────────────────────────────────────────────────
        [HttpGet("health")]
        public async Task<IActionResult> GetCacheHealth()
        {
            try
            {
                var stats = await _redisService.GetCacheStatsAsync();

                return Ok(new
                {
                    success = true,
                    status = "✅ Redis Connected",
                    message = "Cache is operational",
                    timestamp = DateTime.UtcNow,
                    stats = stats
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Redis health check failed: {ex.Message}");

                return StatusCode(503, new
                {
                    success = false,
                    status = "❌ Redis Unavailable",
                    message = "Cache is not operational",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow
                });
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // POST: api/cache/warmup
        // Pre-load cache with product data
        // (Admin only)
        // ────────────────────────────────────────────────────────────────────────────
        [Authorize(Roles = "Admin")]
        [HttpPost("warmup")]
        public async Task<IActionResult> WarmupCache()
        {
            try
            {
                // This would be called after deployment to pre-load cache
                // Actual implementation depends on your GetAllProducts logic
                
                _logger.LogInformation("🔥 Cache warmup requested");

                return Ok(new
                {
                    success = true,
                    message = "Cache warmup initiated",
                    info = "Products will be cached on first read or manual cache load"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Cache warmup error: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to warmup cache"
                });
            }
        }

        // ────────────────────────────────────────────────────────────────────────────
        // GET: api/cache/info
        // Get encoded ID info
        // ────────────────────────────────────────────────────────────────────────────
        [HttpGet("info/encode/{productId:int}")]
        public IActionResult GetEncodedId(int productId)
        {
            try
            {
                var encoded = IdEncoder.Encode(productId);

                return Ok(new
                {
                    success = true,
                    productId,
                    encodedId = encoded,
                    cacheKeyFormat = $"product:{encoded}",
                    timestampKeyFormat = $"product:{encoded}:time",
                    message = "Encoding successful"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error encoding ID: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to encode ID"
                });
            }
        }

        [HttpGet("info/decode/{encodedId}")]
        public IActionResult GetDecodedId(string encodedId)
        {
            try
            {
                if (IdEncoder.TryDecode(encodedId, out int productId))
                {
                    return Ok(new
                    {
                        success = true,
                        encodedId,
                        productId,
                        message = "Decoding successful"
                    });
                }
                else
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid encoded ID format"
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error decoding ID: {ex.Message}");
                return StatusCode(500, new
                {
                    success = false,
                    message = "Failed to decode ID"
                });
            }
        }
    }
}
