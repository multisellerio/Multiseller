﻿using System.Collections.Generic;

namespace MultiSellerIo.Dal.Entity
{
    public class ProductAttribute : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        //Metadata for product attribute
        public string Meta { get; set; }
        public virtual IList<ProductAttributeValue> ProductAttributeValues { get; set; }

    }
}
