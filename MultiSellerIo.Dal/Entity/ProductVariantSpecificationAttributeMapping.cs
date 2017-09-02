namespace MultiSellerIo.Dal.Entity
{
    public class ProductVariantSpecificationAttributeMapping : BaseEntity
    {
        public long ProductVariantId { get; set; }
        public virtual ProductVariant ProductVariant { get; set; }
        public long ProductAttributeValueId { get; set; }
        public virtual ProductAttributeValue ProductAttributeValue{ get; set; }
    }
}