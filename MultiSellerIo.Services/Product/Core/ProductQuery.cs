using System;
using System.Linq.Expressions;
using MultiSellerIo.Common.Util;

namespace MultiSellerIo.Services.Product.Core
{
    public class ProductQuery
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string SearchText { get; set; }
        public long? CategoryId { get; set; }
        public long UserId { get; set; }

        public Expression<Func<Dal.Entity.Product, bool>> GenerateQuery()
        {
            Expression<Func<Dal.Entity.Product, bool>> productQuery = product =>
                product.UserId == UserId && !product.IsDeleted;

            if (!string.IsNullOrEmpty(SearchText) && !string.IsNullOrWhiteSpace(SearchText))
            {
                Expression<Func<Dal.Entity.Product, bool>> searchTextQuery =
                    product => product.Title.ToLower().Contains(SearchText);

                productQuery = productQuery.And(searchTextQuery);
            }

            if (CategoryId.HasValue)
            {
                var categoryId = CategoryId.Value;
                Expression<Func<Dal.Entity.Product, bool>> categoryFilter = product => product.CategoryId == categoryId;

                productQuery = productQuery.And(categoryFilter);
            }

            return productQuery;
        }
    }
}