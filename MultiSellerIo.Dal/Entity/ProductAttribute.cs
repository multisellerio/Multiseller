using System.Collections.Generic;

namespace MultiSellerIo.Dal.Entity
{
    public class ProductAttribute : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }

        public virtual IList<ProductAttributeValue> ProductAttributeValues { get; set; }

    }
}
