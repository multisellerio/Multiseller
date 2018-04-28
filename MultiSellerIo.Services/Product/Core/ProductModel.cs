using System.Collections.Generic;

namespace MultiSellerIo.Services.Product.Core
{
    public class ProductModel
    {
        public long Id { get; set; }
        public string Slug { get; set; }
        public long CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string CategorySlug { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Vendor { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public List<string> Images { get; set; }

    }
}