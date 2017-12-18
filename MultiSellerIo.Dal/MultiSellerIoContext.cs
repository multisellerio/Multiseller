using System.Threading;
using System.Threading.Tasks;
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
        Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken());
    }

    public class MultiSellerIoContext : IdentityDbContext<User, Role, long>, IMultiSellerIoContext
    {
        public MultiSellerIoContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<CategoryAttribute> CategoryAttributes { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductAttribute> ProductAttributes { get; set; }
        public DbSet<ProductAttributeValue> ProductAttributeValues { get; set; }
        public DbSet<EmailTemplate> EmailTemplates { get; set; }
        public DbSet<ProductVariantSpecificationAttributeMapping> ProductVariantSpecificationAttributeMappings { get; set; }
        public DbSet<Country> Countries { get; set; }
        public DbSet<State> States { get; set; }
        public DbSet<City> Cities { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<ShippingCost> ShippingCosts { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>()
                .HasOne(user => user.Store)
                .WithOne(store => store.User)
                .HasForeignKey<User>(user => user.StoreId)
                .IsRequired(false);

            builder.Entity<Store>()
                .HasOne(store => store.User)
                .WithOne(user => user.Store)
                .HasForeignKey<Store>(store => store.UserId)
                .IsRequired(true);

            base.OnModelCreating(builder);
        }
    }
}
