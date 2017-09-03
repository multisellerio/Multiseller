using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Dal.Repository;
using MultiSellerIo.Services.Cache;

namespace MultiSellerIo.Services.Product
{
    public interface IProductCategoryService
    {
        Task<List<Category>> GetCategories();
    }

    public class ProductCategoryService : IProductCategoryService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICacheService _cacheService;
        public ProductCategoryService(IUnitOfWork unitOfWork, ICacheService cacheService)
        {
            _unitOfWork = unitOfWork;
            _cacheService = cacheService;
        }

        public async Task<List<Category>> GetCategories()
        {
            return await _cacheService.GetFromCacheIfExists("product-categories", async () =>
            {
                return await _unitOfWork.CategoryRepository.GetAll().Include(category => category.CategoryAttributes)
                    .ToListAsync();
            });
        }
    }
}
