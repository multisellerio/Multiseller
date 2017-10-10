using MultiSellerIo.Core.Enum;

namespace MultiSellerIo.Dal.Entity
{
    public class CategoryAttribute : BaseEntity
    {
        public long CategoryId { get; set; }
        public virtual Category Category { get; set; }
        public long ProductAttributeId { get; set; }
        public virtual ProductAttribute ProductAttribute { get; set; }
        public bool IsRequired { get; set; }
        public CateogryAttributeType AttributeType { get; set; }
        public bool IsGroup { get; set; }
    }
}
