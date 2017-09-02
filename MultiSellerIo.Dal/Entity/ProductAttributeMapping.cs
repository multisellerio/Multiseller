namespace MultiSellerIo.Dal.Entity
{
    public class ProductAttributeMapping : BaseEntity
    {
        public string DefaultImage { get; set; }
        public long ProductId { get; set; }
        public virtual Product Product { get; set; }
        public long ProductAttributeId { get; set; }
        public virtual ProductAttribute ProductAttribute { get; set; }
    }
}