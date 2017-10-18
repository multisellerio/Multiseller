using System;
using System.Linq;
using System.Threading.Tasks;
using MultiSellerIo.Core.Exception;
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

            //If product is invalid, throw service exceptions
            ValidateProduct(product);

            await _unitOfWork.ProductRepository.Add(product);
            await _unitOfWork.SaveChangesAsync();
            return product;
        }

        private void ValidateProduct(Dal.Entity.Product product)
        {
            if (product == null) throw new ArgumentNullException(nameof(product));

            if (!product.Images.Any())
            {
                throw new ServiceException("Product must have at least one image");
            }

            if (!product.ProductVariants.Any())
            {
                throw new ServiceException("Product must have at least one variant");
            }

        }
    }
}
