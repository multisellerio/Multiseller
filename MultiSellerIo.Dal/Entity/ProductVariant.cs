using System.Collections.Generic;

namespace MultiSellerIo.Dal.Entity
{
    public class ProductVariant : BaseEntity
    {
        public decimal Price { get; set; }
        public decimal CompareAtPrice { get; set; }
        public decimal Quantity { get; set; }
        public string Sku { get; set; }
        public string Barcode{ get; set; }
        public virtual List<ProductVariantSpecificationAttributeMapping> ProductVariantSpecificationAttributeMappings { get; set; }
    }
}