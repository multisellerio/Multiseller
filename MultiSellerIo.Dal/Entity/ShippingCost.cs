using MultiSellerIo.Core.Enum;

namespace MultiSellerIo.Dal.Entity
{

    public class ShippingCost : BaseEntity
    {
        public ShippingCostType ShippingCostType { get; set; }
        public long StoreId { get; set; }
        public virtual Store Store { get; set; }
        public long? StateId { get; set; }

        public virtual State State { get; set; }
        public long? CityId { get; set; }
        public virtual City City { get; set; }
        public long? CountryId { get; set; }
        public virtual Country Country { get; set; }
        public decimal Cost { get; set; }
    }
}
