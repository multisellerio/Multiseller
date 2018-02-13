using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MultiSellerIo.Dal
{
    public class MultiSellerIoContextFactory : IDesignTimeDbContextFactory<MultiSellerIoContext>
    {
        public MultiSellerIoContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<MultiSellerIoContext>();
            //optionsBuilder.UseSqlServer("Data Source=.\\SQLEXPRESS;Initial Catalog=m-seller-local;Integrated Security=True");
            optionsBuilder.UseSqlServer("Server=tcp:goodlookdev.database.windows.net,1433;Initial Catalog=good-look-db-dev;Persist Security Info=False;User ID=goodlookadmin;Password=1234qwer@;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=300;");
            return new MultiSellerIoContext(optionsBuilder.Options);
        }
    }
}
