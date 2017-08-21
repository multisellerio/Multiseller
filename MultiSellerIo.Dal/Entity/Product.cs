using System.Collections.Generic;

namespace MultiSellerIo.Dal.Entity
{
    public class Product : BaseEntity
    {
        public long UserId { get; set; }
        public string Slug { get; set; }
        public User User { get; set; }
        public long CategoryId { get; set; }
        public Category Category { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Vendor { get; set; }
        public List<ProductImage> Images { get; set; }
        public decimal Price { get; set; }
        public decimal CompareAtPrice { get; set; }
        public string Sku { get; set; }

        //ISBN, UPC, GTIN, etc
        public string Barcode { get; set; }
        public int Quantity { get; set; }

        //Variants
        public List<ProductVariant> ProductVariants { get; set; }

        //Soft delete
        public bool IsDeleted { get; set; }
    }

    public class ProductImage : BaseEntity
    {
        public long ProductId { get; set; }
        public virtual Product Product { get; set; }
        public string Name { get; set; }
        public string ThumbName { get; set; }
    }

    public class ProductVariant : BaseEntity
    {
        public string Name { get; set; }
        public string Values { get; set; }
    }
}
