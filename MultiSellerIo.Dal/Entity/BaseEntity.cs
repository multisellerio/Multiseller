using System;

namespace MultiSellerIo.Dal.Entity
{
    public class BaseEntity
    {
        public BaseEntity()
        {
            Created = DateTimeOffset.UtcNow;
            Updated = DateTimeOffset.UtcNow;
        }
        public long Id { get; set; }
        public DateTimeOffset Created { get; set; }
        public DateTimeOffset Updated { get; set; }
    }
}
