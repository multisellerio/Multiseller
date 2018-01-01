using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Dal.Repository;
using MultiSellerIo.Services.Cache;
using MultiSellerIo.Core.Exception;
using System.Linq;
using System;

namespace MultiSellerIo.Services.Product
{
    public interface IProductAttributeService
    {
        Task<List<ProductAttribute>> GetProductAttributesAsync();
        Task<ProductAttribute> AddAttributeAsync(ProductAttribute attribute);
        Task<ProductAttribute> EditAttributeAsync(ProductAttribute attribute);
        Task<ProductAttribute> GetByIdAsync(long id);
        Task DeleteAsync(long id);
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

        public async Task<List<ProductAttribute>> GetProductAttributesAsync()
        {
            return await _unitOfWork.ProductAttributeRepository.GetAll().Include(pa => pa.ProductAttributeValues)
                .ToListAsync();
        }

        public async Task<ProductAttribute> GetByIdAsync(long id)
        {
            var productAttribute = await _unitOfWork.ProductAttributeRepository.GetAll().Where(m => m.Id == id).Include(pa => pa.ProductAttributeValues).FirstOrDefaultAsync();

            if (productAttribute == null)
            {
                throw new ServiceException($"Unable to find product attribute");
            }
            return productAttribute;
        }

        public async Task<ProductAttribute> AddAttributeAsync(ProductAttribute attribute)
        {
            await _unitOfWork.ProductAttributeRepository.Add(attribute);
            await _unitOfWork.SaveChangesAsync();
            return attribute;
        }

        public async Task<ProductAttribute> EditAttributeAsync(ProductAttribute attribute)
        {
            var currentAttribute = await GetByIdAsync(attribute.Id);

            currentAttribute.Name = attribute.Name;
            currentAttribute.Meta = attribute.Meta;
            currentAttribute.Description = attribute.Description;
            currentAttribute.Updated = DateTimeOffset.Now;

            //---Update attribute values---

            //Add new attribute values
            currentAttribute.ProductAttributeValues.AddRange(attribute.ProductAttributeValues.Where(attributeValues => attributeValues.Id == 0));

            //Remove, removed attribute values
            currentAttribute.ProductAttributeValues.RemoveAll(attributeValue =>
                attribute.Id != 0 && attribute.ProductAttributeValues.All(updatedAttributeValue =>
                    updatedAttributeValue.Id != attributeValue.Id));

            //Update attribute values
            currentAttribute.ProductAttributeValues.ForEach(attributeValue =>
            {
                var updatedAttributeValue = attribute.ProductAttributeValues.First(item => item.Id == attributeValue.Id);

                attributeValue.Value = updatedAttributeValue.Value;
                attributeValue.Meta = updatedAttributeValue.Meta;
                attributeValue.Updated = DateTimeOffset.Now;

            });

            _unitOfWork.ProductAttributeRepository.Update(currentAttribute);
            await _unitOfWork.SaveChangesAsync();
            return await GetByIdAsync(currentAttribute.Id);
        }

        public async Task DeleteAsync(long id)
        {
            var productAttribute = await _unitOfWork.ProductAttributeRepository.Get(id);

            if (productAttribute == null)
            {
                throw new ServiceException("Invalid product attribute id");
            }

            productAttribute.IsDeleted = true;
            _unitOfWork.ProductAttributeRepository.Update(productAttribute);
            await _unitOfWork.SaveChangesAsync();
        }

    }
}

