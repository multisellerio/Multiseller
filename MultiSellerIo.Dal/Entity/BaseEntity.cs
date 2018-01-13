using System;
using Microsoft.EntityFrameworkCore;

namespace MultiSellerIo.Dal.Entity
{
    public abstract class BaseEntity
    {
        protected BaseEntity()
        {
            Created = DateTimeOffset.UtcNow;
            Updated = DateTimeOffset.UtcNow;
        }
        public long Id { get; set; }
        public DateTimeOffset Created { get; set; }
        public DateTimeOffset Updated { get; set; }

        public virtual void PrepareSave(EntityState state)
        {
            if (state == EntityState.Added)
            {
                Created = DateTimeOffset.UtcNow;
            }

            Updated = DateTimeOffset.UtcNow;
        }
    }
}
