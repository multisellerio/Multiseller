using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace MultiSellerIo.Api.Util
{
    public class MultiSellerAuthorization : AuthorizeAttribute
    {
        public MultiSellerAuthorization()
        {
            this.AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme;
        }
    }
}
