using System.Collections.Generic;
using MultiSellerIo.Core.Enum;

namespace MultiSellerIo.Api.Models
{

    public class ProductSearchBindingModel
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string SearchText { get; set; }
        public decimal? PriceMin { get; set; }
        public decimal? PriceMax { get; set; }
        public string Category { get; set; }
    }

    public class ProductQueryModel
    {
        public int Page{ get; set; }
        public int PageSize { get; set; }
        public string SearchText { get; set; }
        public long? CategoryId { get; set; }
    }

    public class ProductAttributeBindingModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public object Meta { get; set; }
        public IList<ProductAttributeValueBindingModel> ProductAttributeValues { get; set; }
    }

    public class ProductAttributeValueBindingModel
    {
        public long Id { get; set; }
        public string Value { get; set; }
        public object Meta { get; set; }
    }

    public class CategoryBindingModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Slug { get; set; }
        public int? ParentCategoryId { get; set; }
        public IList<CategoryAttributeBindingModel> CategoryAttributes { get; set; }
        public ICollection<CategoryBindingModel> Children { get; set; }
    }

    public class CategoryAttributeBindingModel
    {
        public int Id { get; set; }
        public long ProductAttributeId { get; set; }
        public ProductAttributeBindingModel ProductAttribute { get; set; }
        public bool IsRequired { get; set; }
        public bool IsGroup { get; set; }
        public CateogryAttributeType AttributeType { get; set; }
    }

    public class ProductMetaDataModel
    {
        public List<CategoryBindingModel> Categories { get; set; }
        public List<ProductAttributeBindingModel> ProductAttributes { get; set; }
    }

    public class ProductVariantSpecificationAttributeMappingBindingModel
    {
        public long Id { get; set; }
        public long ProductVariantId { get; set; }
        public long[] ProductAttributeValues { get; set; }
    }

    public class ProductImageBindingModel
    {
        public long Id { get; set; }
        public string Name { get; set; }
    }

    public class ProductVariantBindingModel
    {
        public long Id { get; set; }
        public decimal Price { get; set; }
        public decimal CompareAtPrice { get; set; }
        public decimal Quantity { get; set; }
        public string Sku { get; set; }
        public string Barcode { get; set; }
        public string DefaultImage { get; set; }
        public virtual List<ProductVariantSpecificationAttributeMappingBindingModel> ProductVariantSpecificationAttributeMappings { get; set; }
    }

    public class ProductAttributeMappingBindingModel
    {
        public long Id { get; set; }
        public long ProductAttributeId { get; set; }
    }

    public class ProductBindingModel
    {
        public long Id { get; set; }
        public long CategoryId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Vendor { get; set; }
        public virtual List<ProductImageBindingModel> Images { get; set; }

        //Variants
        public virtual List<ProductVariantBindingModel> ProductVariants { get; set; }

    }

}
