using MultiSellerIo.Common.Pagination;

namespace MultiSellerIo.Services.Product.Core
{
    public class ProductSearchResult
    {
        public PaginationResult<ProductModel> Products { get; set; }
        public ProductFilterMeta Meta { get; set; }
    }

    public class ProductFilterMeta
    {
        public string SearchText { get; set; }
        public decimal? PriceMin { get; set; }
        public decimal? PriceMax { get; set; }
        public long CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string[] Vendors { get; set; }
        public long[] AttributeValues { get; set; }
    }
}
