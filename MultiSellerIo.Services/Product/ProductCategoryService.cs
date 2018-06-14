using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Dal.Repository;
using MultiSellerIo.Services.Cache;
using MultiSellerIo.Core.Exception;
using System;

namespace MultiSellerIo.Services.Product
{
    public interface IProductCategoryService
    {
        Task<List<Category>> GetCategoriesAsync();
        Task<List<Category>> GetAllCategoriesAsync();
        Task<Category> GetByIdAsync(long id);
        Task<Category> AddCategoryAsync(Category category);
        Task DeleteAsync(long id);
        Task<Category> EditCategoriesAsync(Category category);
        Task<Category> GetBySlug(string slug);
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

        public async Task<List<Category>> GetCategoriesAsync()
        {
            await _unitOfWork.CategoryRepository.GetAllAsQueryable()
                .Include(category => category.CategoryAttributes)
                .ThenInclude(categoryAttribute => categoryAttribute.ProductAttribute)
                .ToListAsync();

            return await _unitOfWork.CategoryRepository.GetAllAsQueryable()
            .Where(category => category.ParentCategoryId == null)
                .ToListAsync();
        }

        public async Task<List<Category>> GetAllCategoriesAsync()
        {
            return await _unitOfWork.CategoryRepository.GetAllAsQueryable()
                 .Include(category => category.CategoryAttributes)
                 .ThenInclude(categoryAttribute => categoryAttribute.ProductAttribute)
                 .ToListAsync();
        }

        public async Task<Category> GetByIdAsync(long id)
        {
            var category = await _unitOfWork.CategoryRepository.GetAllAsQueryable()
                .Where(m => m.Id == id)
                .Include(pa => pa.CategoryAttributes)
                .ThenInclude(ca => ca.ProductAttribute)
                .ThenInclude(pa => pa.ProductAttributeValues)
                .FirstOrDefaultAsync();

            if (category == null)
            {
                throw new ServiceException($"Unable to find category");
            }

            return category;
        }

        public async Task<Category> GetBySlug(string slug)
        {
            var categorySlug = slug.ToLower();

            var entity = await _unitOfWork.CategoryRepository
                .GetAllAsQueryable()
                .Include(category => category.CategoryAttributes)
                .ThenInclude(categoryAttribute => categoryAttribute.ProductAttribute)
                .FirstOrDefaultAsync(category => category.Slug == categorySlug);

            if (entity == null)
            {
                throw new ServiceException($"Unable to find category");
            }

            return entity;
        }

        public async Task<Category> AddCategoryAsync(Category category)
        {
            await _unitOfWork.CategoryRepository.Add(category);
            await _unitOfWork.SaveChangesAsync();
            return category;
        }

        public async Task<Category> EditCategoriesAsync(Category category)
        {
            var currentCategory = await GetByIdAsync(category.Id);

            currentCategory.Name = category.Name;
            currentCategory.Slug = category.Slug;
            currentCategory.Description = category.Description;
            currentCategory.ParentCategoryId = category.ParentCategoryId;
            currentCategory.Updated = DateTimeOffset.Now;

            //---Update category attributes---

            //Add new category attributes
            currentCategory.CategoryAttributes.AddRange(category.CategoryAttributes.Where(attributes => attributes.Id == 0));

            //Remove, removed category attributes
            currentCategory.CategoryAttributes.RemoveAll(attribute =>
                category.Id != 0 && category.CategoryAttributes.All(updatedAttribute =>
                    updatedAttribute.Id != attribute.Id));

            //Update category attributes
            currentCategory.CategoryAttributes.ForEach(attribute =>
            {
                var updatedAttributeValue = category.CategoryAttributes.First(item => item.Id == attribute.Id);

                attribute.ProductAttributeId = updatedAttributeValue.ProductAttributeId;
                attribute.IsRequired = updatedAttributeValue.IsRequired;
                attribute.AttributeType = updatedAttributeValue.AttributeType;
                attribute.Updated = DateTimeOffset.Now;

            });

            _unitOfWork.CategoryRepository.Update(currentCategory);
            await _unitOfWork.SaveChangesAsync();
            return await GetByIdAsync(currentCategory.Id);
        }

        public async Task DeleteAsync(long id)
        {
            var category = await _unitOfWork.CategoryRepository.Get(id);

            if (category == null)
            {
                throw new ServiceException("Invalid category id");
            }

            // productAttribute.IsDeleted = true;

            _unitOfWork.CategoryRepository.Update(category);
            await _unitOfWork.SaveChangesAsync();
        }
    }
}
