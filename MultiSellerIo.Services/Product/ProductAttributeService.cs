using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Dal.Repository;
using MultiSellerIo.Services.Cache;

namespace MultiSellerIo.Services.Product
{
    public interface IProductAttributeService
    {
        Task<List<ProductAttribute>> GetProductAttributes();
    }

    public class ProductAttributeService : IProductAttributeService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        public ProductAttributeService(IUnitOfWork unitOfWork, ICacheService cacheService)
        {
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<List<ProductAttribute>> GetProductAttributes()
        {
            return await _cacheService.GetFromCacheIfExists("product-attributes", async() =>
            {
                return await _unitOfWork.ProductAttributeRepository.GetAll().Include(pa => pa.ProductAttributeValues)
                    .ToListAsync();
            });
        }
    }
}

