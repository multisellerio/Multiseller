using Microsoft.AspNetCore.Identity;
using MultiSellerIo.Core.Enum;

namespace MultiSellerIo.Dal.Entity
{
    public class User : IdentityUser<long>
    {
        public long? StoreId { get; set; }
        public virtual Store Store { get; set; }
        public string FirstName{ get; set; }
        public string LastName { get; set; }
        public Gender Gender { get; set; }
    }
}
