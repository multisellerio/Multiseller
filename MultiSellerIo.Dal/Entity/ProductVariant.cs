using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MultiSellerIo.Dal.Entity
{
    public class ProductVariant : BaseEntity
    {
        public decimal Price { get; set; }
        public decimal CompareAtPrice { get; set; }
        [ConcurrencyCheck]
        public int Quantity { get; set; }
        public string Sku { get; set; }
        public string Barcode{ get; set; }
        public string DefaultImage { get; set; }
        public virtual List<ProductVariantSpecificationAttributeMapping> ProductVariantSpecificationAttributeMappings { get; set; }
    }
}