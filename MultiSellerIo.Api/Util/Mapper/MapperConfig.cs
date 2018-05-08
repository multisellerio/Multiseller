using System.Collections.Generic;
using System.Linq;
using AutoMapper;
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

                //Category
                config.CreateMap<CategoryAttribute, CategoryAttributeBindingModel>();
                config.CreateMap<Category, CategoryBindingModel>();
                config.CreateMap<CategoryBindingModel, Category>();

                //User
                config.CreateMap<User, UserResponseBindingModel>();
                config.CreateMap<User, UserBindingModel>();
                config.CreateMap<UpdateUserDetailsBindingModel, UpdateProfileData>();

                #region Product Mapping

                //Product
                config.CreateMap<ProductImageBindingModel, ProductImage>();
                config.CreateMap<ProductImage, ProductImageBindingModel>();

                config.CreateMap<ProductAttributeValue, ProductAttributeValueBindingModel>()
                  .ForMember(member => member.Meta,
                      map => map.MapFrom(src => !string.IsNullOrEmpty(src.Meta) ? JsonConvert.DeserializeObject(src.Meta) : null));
                config.CreateMap<ProductAttribute, ProductAttributeBindingModel>()
                    .ForMember(member => member.Meta,
                        map => map.MapFrom(src => !string.IsNullOrEmpty(src.Meta) ? JsonConvert.DeserializeObject(src.Meta) : null));

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
                                ProductVariantId = src.Id,
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

                config.CreateMap<ProductBindingModel, Product>()
                .ForMember(dest => dest.ProductSpecificationAttributes, option => option.Ignore())
                    .AfterMap((src, dest) =>
                    {
                        if (src.ProductAttributeValues == null)
                        {
                            return;
                        }

                        dest.ProductSpecificationAttributes = src
                            .ProductAttributeValues.Select(attributeValue => new ProductSpecificationAttributeMapping()
                            {
                                ProductAttributeValueId = attributeValue
                            }).ToList();
                    });

                config.CreateMap<Product, ProductBindingModel>()
                .ForMember(dest => dest.ProductAttributeValues, option => option.Ignore())
                    .AfterMap((src, dest) =>
                    {
                        if (src.ProductSpecificationAttributes == null)
                        {
                            return;
                        }

                        dest.ProductAttributeValues = src
                            .ProductSpecificationAttributes
                            .Select(productSpecificationAttribute => productSpecificationAttribute.ProductAttributeValueId)
                            .ToArray();
                    });

                #endregion

                //Country
                config.CreateMap<CountryBindingModel, Country>();
                config.CreateMap<Country, CountryBindingModel>();

                //State
                config.CreateMap<StateBindingModel, State>();
                config.CreateMap<State, StateBindingModel>();

                //City
                config.CreateMap<City, CityBindingModel>();
                config.CreateMap<CityBindingModel, City>();

                //Shipping Cost
                config.CreateMap<ShippingCost, ShippingCostBindingModel>();
                config.CreateMap<ShippingCostBindingModel, ShippingCost>();

                //Store
                config.CreateMap<StoreBindingModel, Store>();
                config.CreateMap<Store, StoreBindingModel>();
                config.CreateMap<CreateOrUpdateStoreBindingModel, Store>();
                config.CreateMap<Store, CreateOrUpdateStoreBindingModel>();

            });
        }
    }
}
