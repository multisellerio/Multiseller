using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Dal.Repository.Core;

namespace MultiSellerIo.Dal.Repository
{
    public interface IUnitOfWork
    {
        Task<IDbContextTransaction> GetTransaction();
        IRepository<Product> ProductRepository { get; }
        IRepository<Category> CategoryRepository { get; }
        IRepository<ProductAttribute> ProductAttributeRepository { get; }
    }

    public class UnitOfWork : IUnitOfWork
    {
        private readonly IMultiSellerIoContext _context;

        private IRepository<Category> _categoryRepository;
        private IRepository<Product> _productRepository;
        private IRepository<ProductAttribute> _productAttributeRepository;

        public UnitOfWork(IMultiSellerIoContext context)
        {
            _context = context;
        }

        public async Task<IDbContextTransaction> GetTransaction()
        {
            return await _context.Database.BeginTransactionAsync();
        }

        public IRepository<Category> CategoryRepository => _categoryRepository ??
                                                           new GenericRepository<Category>(_context);

        public IRepository<Product> ProductRepository => _productRepository ??
                                                         new GenericRepository<Product>(_context);

        public IRepository<ProductAttribute> ProductAttributeRepository => _productAttributeRepository ??
                                                         new GenericRepository<ProductAttribute>(_context);

    }
}
