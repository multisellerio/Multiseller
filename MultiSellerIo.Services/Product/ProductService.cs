using System.Threading.Tasks;
using MultiSellerIo.Dal.Repository;

namespace MultiSellerIo.Services.Product
{
    public interface IProductService
    {
        Task<Dal.Entity.Product> AddProduct(Dal.Entity.Product product);
    }

    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;
        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Dal.Entity.Product> AddProduct(Dal.Entity.Product product)
        {
            await _unitOfWork.ProductRepository.Add(product);
            await _unitOfWork.SaveChangesAsync();
            return product;
        }
    }
}
