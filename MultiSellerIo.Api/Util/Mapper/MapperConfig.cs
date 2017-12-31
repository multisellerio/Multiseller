using System.Collections.Generic;
using System.Linq;
using MultiSellerIo.Api.Models;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Services.User.Core;
using Newtonsoft.Json;

namespace MultiSellerIo.Api.Util.Mapper
{
    public class MapperConfig
    {
        public static void Initialize()
        {
            AutoMapper.Mapper.Initialize(config =>
            {
                config.CreateMap<ProductAttributeValue, ProductAttributeValueBindingModel>()
                    .ForMember(member => member.Meta,
                        map => map.MapFrom(src => !string.IsNullOrEmpty(src.Meta) ? JsonConvert.DeserializeObject(src.Meta) : null));
                config.CreateMap<ProductAttribute, ProductAttributeBindingModel>()
                    .ForMember(member => member.Meta,
                        map => map.MapFrom(src => !string.IsNullOrEmpty(src.Meta) ? JsonConvert.DeserializeObject(src.Meta) : null));
                config.CreateMap<CategoryAttribute, CategoryAttributeBindingModel>();
                config.CreateMap<Category, CategoryBindingModel>();
                config.CreateMap<CategoryBindingModel, Category>();
                config.CreateMap<User, UserBindingModel>();
                config.CreateMap<ProductAttributeValueBindingModel, ProductAttributeValue>();
                config.CreateMap<ProductAttributeBindingModel, ProductAttribute>();
                config.CreateMap<ProductImageBindingModel, ProductImage>();
                config.CreateMap<ProductImage, ProductImageBindingModel>();
                config.CreateMap<ProductVariant, ProductVariantBindingModel>()
                    .ForMember(dest => dest.ProductVariantSpecificationAttributeMappings, option => option.Ignore())
                    .AfterMap((src, dest) =>
                    {
                        if (src.ProductVariantSpecificationAttributeMappings == null)
                        {
                            return;
                        }

                        dest.ProductVariantSpecificationAttributeMappings = src
                            .ProductVariantSpecificationAttributeMappings
                            .GroupBy(attribute => attribute.ProductAttributeValue.ProductAttributeId)
                            .Select(groupAttribute => new ProductVariantSpecificationAttributeMappingBindingModel()
                            {
                                ProductVariantId = groupAttribute.Key,
                                ProductAttributeValues = groupAttribute.Select(attribute => attribute.ProductAttributeValueId).ToArray()
                            }).ToList();
                    });
                config.CreateMap<ProductVariantBindingModel, ProductVariant>()
                    .ForMember(dest => dest.ProductVariantSpecificationAttributeMappings, option => option.Ignore())
                    .AfterMap((src, dest) =>
                    {
                        if (src.ProductVariantSpecificationAttributeMappings == null)
                        {
                            return;
                        }

                        dest.ProductVariantSpecificationAttributeMappings = src
                            .ProductVariantSpecificationAttributeMappings.SelectMany(attribute => attribute
                                .ProductAttributeValues.Select(
                                    value => new ProductVariantSpecificationAttributeMapping()
                                    {
                                        ProductVariantId = attribute.ProductVariantId,
                                        ProductAttributeValueId = value
                                    }).ToList()).ToList();
                    });

                config.CreateMap<ProductBindingModel, Product>();
                config.CreateMap<Product, ProductBindingModel>();

                config.CreateMap<StateBindingModel, State>();
                config.CreateMap<State, StateBindingModel>();

                config.CreateMap<City, CityBindingModel>();
                config.CreateMap<CityBindingModel, City>();

                config.CreateMap<ShippingCost, ShippingCostBindingModel>();
                config.CreateMap<ShippingCostBindingModel, ShippingCost>();

                config.CreateMap<StoreBindingModel, Store>();
                config.CreateMap<Store, StoreBindingModel>();

                config.CreateMap<CreateOrUpdateStoreBindingModel, Store>();
                config.CreateMap<Store, CreateOrUpdateStoreBindingModel>();

                config.CreateMap<UpdateUserDetailsBindingModel, UpdateProfileData>();

            });
        }
    }
}
