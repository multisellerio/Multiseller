using MultiSellerIo.Core.Interfaces;
using System.Collections.Generic;

namespace MultiSellerIo.Dal.Entity
{
    public class ProductAttribute : BaseEntity, IFlagDelete
    {
        public string Name { get; set; }
        public string Description { get; set; }
        //Metadata for product attribute
        public string Meta { get; set; }
        public virtual List<ProductAttributeValue> ProductAttributeValues { get; set; }
        public bool IsDeleted { get; set; }
    }
}
