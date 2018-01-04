using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MultiSellerIo.Dal
{
    public class MultiSellerIoContextFactory : IDesignTimeDbContextFactory<MultiSellerIoContext>
    {
        public MultiSellerIoContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<MultiSellerIoContext>();
            optionsBuilder.UseSqlServer("Data Source=.;Initial Catalog=m-seller-local;Integrated Security=True");

            return new MultiSellerIoContext(optionsBuilder.Options);
        }
    }
}
