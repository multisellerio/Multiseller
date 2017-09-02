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
                config.CreateMap<User, UserResponseBindingModel>();
            });
        }
    }
}
