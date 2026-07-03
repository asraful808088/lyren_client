using Algolia.Search.Clients;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Sql.Models;
using Sql.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Sql 
{
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

    
    }
}