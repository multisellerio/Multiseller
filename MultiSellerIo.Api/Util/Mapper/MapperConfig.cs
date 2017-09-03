using MultiSellerIo.Api.Models;
using MultiSellerIo.Dal.Entity;

namespace MultiSellerIo.Api.Util.Mapper
{
    public class MapperConfig
    {
        public static void Initialize()
        {
            AutoMapper.Mapper.Initialize(config =>
            {
                config.CreateMap<ProductAttributeValue, ProductAttributeValueBindingModel>();
                config.CreateMap<ProductAttribute, ProductAttributeBindingModel>();
                config.CreateMap<CategoryAttribute, CategoryAttributeBindingModel>();
                config.CreateMap<Category, CategoryBindingModel>();
                config.CreateMap<User, UserResponseBindingModel>();

                config.CreateMap<ProductAttributeValueBindingModel, ProductAttributeValue>();
                config.CreateMap<ProductAttributeBindingModel, ProductAttribute>();

            });
        }
    }
}
