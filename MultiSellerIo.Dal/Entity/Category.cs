using System.Collections.Generic;

namespace MultiSellerIo.Dal.Entity
{
    public class Category : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Slug { get; set; }
        public virtual List<CategoryAttribute> CategoryAttributes { get; set; }
        public long? ParentCategoryId { get; set; }
        public virtual Category ParentCategory { get; set; }
    }
}
