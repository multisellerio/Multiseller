using System;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MultiSellerIo.Dal.Entity;

namespace MultiSellerIo.Api.Util.Token
{
    public class TokenProvider : DataProtectorTokenProvider<User>
    {
        public TokenProvider(IDataProtectionProvider dataProtectionProvider, IOptions<DataProtectionTokenProviderOptions> options) : base(dataProtectionProvider, options)
        {
            this.Options.TokenLifespan = TimeSpan.FromDays(1);
        }
    }
}
