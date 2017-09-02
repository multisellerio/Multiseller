namespace MultiSellerIo.Dal.Entity
{
    public class ProductImage : BaseEntity
    {
        public long ProductId { get; set; }
        public virtual Product Product { get; set; }
        public string Name { get; set; }
        public string ThumbName { get; set; }
    }
}