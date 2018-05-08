using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MultiSellerIo.Common.Pagination;
using MultiSellerIo.Common.String;
using MultiSellerIo.Common.Util;
using MultiSellerIo.Core.Exception;
using MultiSellerIo.Dal.Repository;
using MultiSellerIo.Services.Product.Core;

namespace MultiSellerIo.Services.Product
{
    public interface IProductService
    {
        Task<Dal.Entity.Product> AddProduct(Dal.Entity.Product product);
        Task<Dal.Entity.Product> UpdateProduct(Dal.Entity.Product product);
        Task<PaginationResult<ProductModel>> GetProductsAsync(ProductQuery query);
        Task<ProductSearchResult> SearchProductAsync(SearchProductCriteria criteria);
        Task<Dal.Entity.Product> GetById(long id);
        Task Delete(long id, long userId);
    }

    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<ProductSearchResult> SearchProductAsync(SearchProductCriteria criteria)
        {

            var categorySlug = criteria.Category.ToLower();
            var category = await _unitOfWork.CategoryRepository.GetAll().Where(c => c.Slug.ToLower() == categorySlug)
                .FirstOrDefaultAsync();

            if (category == null)
            {
                throw new ServiceException("Unable to find category");
            }

            var productQuery = criteria.GenerateQuery();

            var count = await _unitOfWork.ProductRepository.GetAll()
                .CountAsync(productQuery);

            var metaQuery = criteria.GenerateQueryForMeta();

            var maxPrice = await _unitOfWork.ProductRepository.GetAll()
                .Where(metaQuery)
                .Include(product => product.Category)
                .Include(product => product.ProductVariants)
                .MaxAsync(product => product.ProductVariants.Max(variant => variant.Price));

            var minPrice = await _unitOfWork.ProductRepository.GetAll()
                .Where(metaQuery)
                .Include(product => product.Category)
                .Include(product => product.ProductVariants)
                .MinAsync(product => product.ProductVariants.Min(variant => variant.Price));

            var vendors = await _unitOfWork.ProductRepository.GetAll()
                .Where(metaQuery)
                .Include(product => product.Category)
                .Select(product => product.Vendor)
                .Distinct()
                .Select(vendor => vendor.ToTitleCase())
                .ToListAsync();

            var productAttributes = await _unitOfWork.ProductRepository.GetAll()
                .Where(metaQuery)
                .Include(product => product.Category)
                .Include(product => product.ProductVariants)
                .ThenInclude(productVariant => productVariant.ProductVariantSpecificationAttributeMappings)
                .SelectMany(product => product.ProductVariants.SelectMany(variant =>
                    variant.ProductVariantSpecificationAttributeMappings.Select(variantSpecification =>
                        variantSpecification.ProductAttributeValueId)))
                .Distinct()
                .ToListAsync();

            var productMeta = new ProductFilterMeta
            {
                PriceMax = maxPrice,
                PriceMin = minPrice,
                SearchText = criteria.SearchText,
                CategoryId = category.Id,
                CategoryName = category.Name,
                AttributeValues = productAttributes.ToArray(),
                Vendors = vendors.ToArray()
            };

            var result = await _unitOfWork.ProductRepository.GetAll()
                .Where(productQuery)
                .Skip((criteria.Page - 1) * criteria.PageSize)
                .Take(criteria.PageSize)
                .Include(product => product.Images)
                .Include(product => product.Category)
                .Include(product => product.ProductVariants)
                .Select(product => new ProductModel()
                {
                    Id = product.Id,
                    CategoryId = product.CategoryId,
                    CategoryName = product.Category.Name,
                    CategorySlug = product.Category.Slug,
                    Slug = product.Slug,
                    Title = product.Title,
                    Description = product.Description,
                    Vendor = product.Vendor,
                    Price = product.ProductVariants.Min(variation => variation.Price),
                    Quantity = product.ProductVariants.Sum(variant => variant.Quantity),
                    Images = product.Images.Select(img => img.Name).ToList()
                }).ToListAsync();


            var productResult = new PaginationResult<ProductModel>(count, criteria.Page, criteria.PageSize, result);

            return new ProductSearchResult()
            {
                Meta = productMeta,
                Products = productResult
            };
        }

        public async Task<PaginationResult<ProductModel>> GetProductsAsync(ProductQuery query)
        {
            var productQuery = query.GenerateQuery();

            var count = await _unitOfWork.ProductRepository.GetAll()
                .Where(productQuery)
                .CountAsync();

            var result = await _unitOfWork.ProductRepository.GetAll()
                .Where(productQuery)
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .Include(product => product.Images)
                .Include(product => product.Category)
                .Include(product => product.ProductVariants)
                .Select(product => new ProductModel()
                {
                    Id = product.Id,
                    CategoryId = product.CategoryId,
                    CategoryName = product.Category.Name,
                    Slug = product.Slug,
                    Title = product.Title,
                    Description = product.Description,
                    Vendor = product.Vendor,
                    Price = product.ProductVariants.Min(variation => variation.Price),
                    Quantity = product.ProductVariants.Sum(variant => variant.Quantity),
                    Images = product.Images.Select(img => img.Name).ToList()
                }).ToListAsync();

            return new PaginationResult<ProductModel>(count, query.Page, query.PageSize, result);
        }

        public async Task<Dal.Entity.Product> AddProduct(Dal.Entity.Product product)
        {

            //If product is invalid, throw service exceptions
            ValidateProduct(product);

            await GenerateProductSlug(product);

            await _unitOfWork.ProductRepository.Add(product);
            await _unitOfWork.SaveChangesAsync();
            return await GetById(product.Id);
        }

        public async Task<Dal.Entity.Product> UpdateProduct(Dal.Entity.Product product)
        {

            var currentProduct = await GetById(product.Id);

            //Generate slug if title is changed
            if (currentProduct.Title != product.Title || string.IsNullOrEmpty(currentProduct.Slug))
            {
                await GenerateProductSlug(product);
                currentProduct.Slug = product.Slug;
            }

            currentProduct.CategoryId = product.CategoryId;
            currentProduct.Title = product.Title;
            currentProduct.Description = product.Description;
            currentProduct.Vendor = product.Vendor;
            currentProduct.Updated = DateTimeOffset.Now;

            //---Update images---

            //Add new images
            var addedImages = product.Images.Where(image =>
                currentProduct.Images.All(currentProductImage => currentProductImage.Name != image.Name))
                .ToList();

            //Remove, removed images
            currentProduct.Images.RemoveAll(image =>
                product.Images.All(updateProductImage => updateProductImage.Name != image.Name));

            currentProduct.Images.AddRange(addedImages);

            //---Update product variants---

            //Add new product variants
            currentProduct.ProductVariants.AddRange(product.ProductVariants.Where(productVariants => productVariants.Id == 0));

            //Remove, removed product variants
            currentProduct.ProductVariants.RemoveAll(productVariant =>
                product.Id != 0 && product.ProductVariants.All(updatedProductVariant =>
                    updatedProductVariant.Id != productVariant.Id));

            //Update product attributes
            currentProduct.ProductSpecificationAttributes.AddRange(product.ProductSpecificationAttributes.Where(
                attributeMapping => currentProduct.ProductSpecificationAttributes.All(
                    currentAttributeMapping => attributeMapping.ProductAttributeValueId != currentAttributeMapping.ProductAttributeValueId)));

            currentProduct.ProductSpecificationAttributes.RemoveAll(
                attributeMapping => product.ProductSpecificationAttributes.All(
                    currentAttributeMapping => attributeMapping.ProductAttributeValueId != currentAttributeMapping.ProductAttributeValueId));

            //Update product variants
            currentProduct.ProductVariants.ForEach(productVariant =>
            {
                var updatedProductVariant = product.ProductVariants.First(variant => variant.Id == productVariant.Id);

                productVariant.Price = updatedProductVariant.Price;
                productVariant.DefaultImage = updatedProductVariant.DefaultImage;
                productVariant.Barcode = updatedProductVariant.Barcode;
                productVariant.Sku = updatedProductVariant.Sku;
                productVariant.CompareAtPrice = updatedProductVariant.CompareAtPrice;
                productVariant.Quantity = updatedProductVariant.Quantity;

                //Add new attribute mappings
                productVariant.ProductVariantSpecificationAttributeMappings.AddRange(updatedProductVariant.ProductVariantSpecificationAttributeMappings.Where(
                    attributeMapping => productVariant.ProductVariantSpecificationAttributeMappings.All(
                        currentAttributeMapping => attributeMapping.ProductAttributeValueId != currentAttributeMapping.ProductAttributeValueId)));

                //Remove, removed attribute mappings
                productVariant.ProductVariantSpecificationAttributeMappings.RemoveAll(
                    attributeMapping => updatedProductVariant.ProductVariantSpecificationAttributeMappings.All(
                        currentAttributeMapping => attributeMapping.ProductAttributeValueId != currentAttributeMapping.ProductAttributeValueId));
            });

            //If product is invalid, throw service exceptions
            ValidateProduct(currentProduct);

            _unitOfWork.ProductRepository.Update(currentProduct);
            await _unitOfWork.SaveChangesAsync();
            return await GetById(currentProduct.Id);
        }

        public async Task<Dal.Entity.Product> GetById(long id)
        {
            var currentProduct = await _unitOfWork.ProductRepository.GetAll()
                .Where(product => product.Id == id && !product.IsDeleted)
                .Include(product => product.Images)
                .Include(product => product.ProductSpecificationAttributes)
                .ThenInclude(specificationAttribute => specificationAttribute.ProductAttributeValue)
                .Include(product => product.ProductVariants)
                .ThenInclude(productVariant => productVariant.ProductVariantSpecificationAttributeMappings)
                .ThenInclude(attributeMapping => attributeMapping.ProductAttributeValue)
                .FirstOrDefaultAsync();

            if (currentProduct == null)
            {
                throw new ServiceException($"Unable to find product");
            }

            return currentProduct;
        }

        public async Task Delete(long id, long userId)
        {
            var product = await _unitOfWork.ProductRepository.Get(id);

            if (product.UserId != userId)
            {
                throw new ServiceException("Unauthorized action");
            }

            product.IsDeleted = true;

            _unitOfWork.ProductRepository.Update(product);
            await _unitOfWork.SaveChangesAsync();
        }

        private void ValidateProduct(Dal.Entity.Product product)
        {
            if (product == null) throw new ArgumentNullException(nameof(product));

            if (!product.Images.Any())
            {
                throw new ServiceException("Product must have at least one image");
            }

            if (!product.ProductVariants.Any())
            {
                throw new ServiceException("Product must have at least one variant");
            }

        }

        private async Task GenerateProductSlug(Dal.Entity.Product product)
        {
            var generatedSlug = SlugExtenstions.ToUrlSlug(product.Title);
            var slug = generatedSlug;

            if (await _unitOfWork.ProductRepository.GetAll().AnyAsync(p => p.Slug == generatedSlug))
            {
                var existsSlugCount = await _unitOfWork.ProductRepository.GetAll().CountAsync(p => p.Slug == generatedSlug);
                slug = SlugExtenstions.ToUrlSlug($"{product.Title}-{existsSlugCount}");
            }

            product.Slug = slug;
        }
    }
}
