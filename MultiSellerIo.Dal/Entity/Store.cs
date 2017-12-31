using System.Collections.Generic;

namespace MultiSellerIo.Dal.Entity
{
    public class Store : BaseEntity
    {
        public long UserId { get; set; }
        public string ProfileImage { get; set; }
        public virtual User User { get; set; }
        public string StoreName { get; set; }
        public string Slug { get; set; }
        public string ShippingInformation { get; set; }
        public string PaymentAndRefundPolicies { get; set; }
        public bool Verified { get; set; }
        public ICollection<ShippingCost> ShippingCosts { get; set; }
    }
}
