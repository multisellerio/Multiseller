namespace MultiSellerIo.Dal.Entity
{
    public class ProductAttributeValue : BaseEntity
    {
        public long ProductAttributeId { get; set; }
        public virtual ProductAttribute ProductAttribute { get; set; }
        public string Value { get; set; }

        //Metadata for attribue values
        public string Meta { get; set; }

    }
}