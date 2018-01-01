using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using MultiSellerIo.Core.Enum;

namespace MultiSellerIo.Api.Models
{
    public class CreateOrUpdateStoreBindingModel
    {
        [Required]
        public string StoreName { get; set; }
        [Required]
        public string ShippingInformation { get; set; }
        [Required]
        public string PaymentAndRefundPolicies { get; set; }
    }

    public class CreateOrUpdateShippingBindingModel
    {
        public ICollection<ShippingCostBindingModel> ShippingCosts { get; set; }
    }

    public class StoreBindingModel
    {
        public long Id { get; set; }
        public long UserId { get; set; }
        public virtual UserBindingModel User { get; set; }
        public string StoreName { get; set; }
        public string Slug { get; set; }
        public string ShippingInformation { get; set; }
        public string PaymentAndRefundPolicies { get; set; }
        public bool Verified { get; set; }
        public ICollection<ShippingCostBindingModel> ShippingCosts { get; set; }
    }

    public class ShippingCostBindingModel
    {
        public long Id { get; set; }
        public ShippingCostType ShippingCostType { get; set; }
        public long? CityId { get; set; }
        public long? CountryId { get; set; }
        public decimal Cost { get; set; }
    }

}
