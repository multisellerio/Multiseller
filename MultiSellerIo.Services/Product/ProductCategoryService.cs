using System.Collections.Generic;
using System.Linq;
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
                //Load all the categories
                await _unitOfWork.CategoryRepository.GetAll()
                    .Include(category => category.CategoryAttributes)
                    .ThenInclude(categoryAttribute => categoryAttribute.ProductAttribute)
                    .ToListAsync();

                return await _unitOfWork.CategoryRepository.GetAll()
                .Where(category => category.ParentCategoryId == null)
                    .ToListAsync();
            });
        }
    }
}
