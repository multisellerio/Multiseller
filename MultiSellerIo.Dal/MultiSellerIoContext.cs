using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Infrastructure;
using MultiSellerIo.Dal.Entity;

namespace MultiSellerIo.Dal
{
    public interface IMultiSellerIoContext
    {
        DatabaseFacade Database { get; }
        DbSet<T> Set<T>() where  T: class;
        EntityEntry<T> Update<T>(T entity) where T : class;
        EntityEntry<T> Entry<T>(T entity) where T : class;
    }

    public class MultiSellerIoContext : IdentityDbContext<User, Role, long>, IMultiSellerIoContext
    {
        public MultiSellerIoContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }

    }
}
