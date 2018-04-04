namespace MultiSellerIo.Dal.Entity
{
    public class ProductAttributeMapping : BaseEntity
    {
        public long ProductId { get; set; }
        public virtual Product Product { get; set; }
        public long ProductAttributeValueId { get; set; }
        public virtual ProductAttributeValue ProductAttributeValue { get; set; }
    }
}