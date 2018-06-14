using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MultiSellerIo.Core.Enum;
using MultiSellerIo.Services.Product.Core;

namespace MultiSellerIo.Services.Product
{
    public interface IProductAttributeSeparateService
    {
        Task<SeparatedAttributeValueResult> SeparateAttributeValues(long categoryId, long[] attributeValues);
    }

    public class ProductAttributeSeparateService : IProductAttributeSeparateService
    {
        private readonly IProductCategoryService _categoryService;
        private readonly IProductAttributeService _attributeService;

        public ProductAttributeSeparateService(IProductCategoryService categoryService, 
            IProductAttributeService attributeService)
        {
            _categoryService = categoryService;
            _attributeService = attributeService;
        }

        public async Task<SeparatedAttributeValueResult> SeparateAttributeValues(long categoryId, long[] attributeValues)
        {
            var separationAttributeValues = new List<long>();
            var separationSpecificationValues = new List<long>();

            var category = await _categoryService.GetByIdAsync(categoryId);

            await attributeValues.ToAsyncEnumerable().ForEachAsync(attributeValue =>
            {
                var categoryAttribute = category.CategoryAttributes.FirstOrDefault(ca =>
                    ca.ProductAttribute.ProductAttributeValues.Exists(value => value.Id == attributeValue));

                if (categoryAttribute == null)
                {
                    return;
                }

                if (categoryAttribute.AttributeType == CateogryAttributeType.Simple)
                {
                    separationSpecificationValues.Add(attributeValue);
                }

                if (categoryAttribute.AttributeType == CateogryAttributeType.Variant)
                {
                    separationAttributeValues.Add(attributeValue);
                }

            });

            return new SeparatedAttributeValueResult()
            {
                AttributeValues = separationAttributeValues.ToArray(),
                SpecificationAttributeValues = separationSpecificationValues.ToArray()
            };
        }
    }
}
