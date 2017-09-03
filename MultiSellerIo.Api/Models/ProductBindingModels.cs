using System.Collections.Generic;
using MultiSellerIo.Dal.Entity;

namespace MultiSellerIo.Api.Models
{
    public class ProductAttributeBindingModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IList<ProductAttributeValueBindingModel> ProductAttributeValues { get; set; }
    }

    public class ProductAttributeValueBindingModel
    {
        public long Id { get; set; }
        public string Value { get; set; }
    }

    public class CategoryBindingModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Slug { get; set; }
        public IList<CategoryAttributeBindingModel> CateogoryAttributes { get; set; }
    }

    public class CategoryAttributeBindingModel
    {
        public int Id { get; set; }
        public long ProductAttributeId { get; set; }
        public bool IsRequired { get; set; }
    }

    public class ProductMetaDataModel
    {
        public List<CategoryBindingModel> Categories { get; set; }
        public List<ProductAttributeBindingModel> ProductAttributes { get; set; }
    }

}
