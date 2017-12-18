﻿using MultiSellerIo.Core.Enum;

namespace MultiSellerIo.Dal.Entity
{

    public class ShippingCost : BaseEntity
    {
        public ShippingCostType ShippingCostType { get; set; }
        public long StoreId { get; set; }
        public virtual Store Store { get; set; }
        public long? CityId { get; set; }
        public virtual City City { get; set; }
        public decimal Cost { get; set; }
    }
}
