using System;
using System.Linq;
using System.Linq.Expressions;
using MultiSellerIo.Common.Util;
using MultiSellerIo.Core.Exception;

namespace MultiSellerIo.Services.Product.Core
{
    public class SearchProductCriteria
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string SearchText { get; set; }
        public decimal? PriceMin { get; set; }
        public decimal? PriceMax { get; set; }
        public string Category { get; set; }
        public long[] AttributeValues { get; set; }
        public string[] Vendors { get; set; }

        public bool IsFilterByPrice()
        {
            return PriceMin.HasValue && PriceMax.HasValue;
        }

        public bool IsFilterByAttributes()
        {
            return AttributeValues != null && AttributeValues.Any();
        }

        public bool IsVendorFilter()
        {
            return Vendors != null && Vendors.Any();
        }

        public bool IsFilterBySearchText()
        {
            return !string.IsNullOrWhiteSpace(SearchText) && !string.IsNullOrEmpty(SearchText);
        }

        public Expression<Func<Dal.Entity.Product, bool>> GenerateQuery()
        {

            if (string.IsNullOrEmpty(Category))
            {
                throw new ServiceException("Category slug is required");
            }

            Expression<Func<Dal.Entity.Product, bool>> productQuery = product => !product.IsDeleted;

            var category = Category.ToLower();

            Expression<Func<Dal.Entity.Product, bool>> categoryQuery =
                product => product.Category.Slug.ToLower() == category;

            productQuery = productQuery.And(categoryQuery);

            if (IsFilterBySearchText())
            {
                Expression<Func<Dal.Entity.Product, bool>> searchTextQuery =
                    product => product.Title.ToLower().Contains(SearchText);

                productQuery = productQuery.And(searchTextQuery);
            }

            if (IsVendorFilter())
            {
                var vendors = Vendors.ToList();
                Expression<Func<Dal.Entity.Product, bool>> vendorQuery =
                    product => vendors.Any(vendor => product.Vendor.ToLower() == vendor.ToLower());

                productQuery = productQuery.And(vendorQuery);
            }

            if (IsFilterByPrice())
            {
                var priceMin = PriceMin.Value;
                var priceMax = PriceMax.Value;

                Expression<Func<Dal.Entity.Product, bool>> priceRangeQuery =
                    product => product.ProductVariants.Any(variant =>
                        variant.Price >= priceMin && variant.Price <= priceMax);

                productQuery = productQuery.And(priceRangeQuery);
            }

            if (IsFilterByAttributes())
            {
                var attributeValues = AttributeValues;

                Expression<Func<Dal.Entity.Product, bool>> attributeQuery =
                    product => product.ProductVariants.Any(variant => attributeValues.All(attributeValue =>
                        variant.ProductVariantSpecificationAttributeMappings.Any(variantSpecification =>
                            variantSpecification.ProductAttributeValueId == attributeValue)));

                productQuery = productQuery.And(attributeQuery);
            }

            return productQuery;
        }

        public Expression<Func<Dal.Entity.Product, bool>> GenerateQueryForMeta()
        {
            if (string.IsNullOrEmpty(Category))
            {
                throw new ServiceException("Category slug is required");
            }

            Expression<Func<Dal.Entity.Product, bool>> productQuery = product => !product.IsDeleted;

            var category = Category.ToLower();

            Expression<Func<Dal.Entity.Product, bool>> categoryQuery =
                product => product.Category.Slug.ToLower() == category;

            productQuery = productQuery.And(categoryQuery);

            if (!string.IsNullOrWhiteSpace(SearchText))
            {
                Expression<Func<Dal.Entity.Product, bool>> searchTextQuery =
                    product => product.Title.ToLower().Contains(SearchText);

                productQuery = productQuery.And(searchTextQuery);
            }

            return productQuery;
        }
    }
}