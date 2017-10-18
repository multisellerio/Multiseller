using System.Collections.Generic;

namespace MultiSellerIo.Dal.Entity
{
    public class Product : BaseEntity
    {
        public long UserId { get; set; }
        public string Slug { get; set; }
        public virtual User User { get; set; }
        public long CategoryId { get; set; }
        public virtual Category Category { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Vendor { get; set; }
        public virtual List<ProductImage> Images { get; set; }
        public string DefaultImage { get; set; }
        //Variants
        public virtual List<ProductVariant> ProductVariants { get; set; }
        //Soft delete
        public bool IsDeleted { get; set; }
    }
}
