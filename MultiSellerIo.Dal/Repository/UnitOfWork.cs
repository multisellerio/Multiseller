﻿using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Dal.Repository.Core;
using Remotion.Linq.Clauses;

namespace MultiSellerIo.Dal.Repository
{
    public interface IUnitOfWork
    {
        Task<IDbContextTransaction> GetTransaction();
        IRepository<Product> ProductRepository { get; }
        IRepository<Category> CategoryRepository { get; }
        IRepository<ProductAttribute> ProductAttributeRepository { get; }
        IRepository<EmailTemplate> EmailTemplateRepository { get; }
        IRepository<Store> StoreRepository { get; }
        IRepository<City> CitiesRepository { get; }
        IRepository<State> StatesRepository { get; }
        IRepository<Country> CountriesRepository { get; }
        EntityEntry<T> Entry<T>(T entity) where T : class;
        Task<int> SaveChangesAsync();
    }

    public class UnitOfWork : IUnitOfWork
    {
        private readonly IMultiSellerIoContext _context;

        private IRepository<Category> _categoryRepository;
        private IRepository<Product> _productRepository;
        private IRepository<ProductAttribute> _productAttributeRepository;
        private IRepository<EmailTemplate> _emailTemplateRepository;
        private IRepository<Store> _storeRepository;
        private IRepository<State> _statesRepository;
        private IRepository<City> _citiesRepository;
        private IRepository<Country> _countiresRepository;

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

        public IRepository<EmailTemplate> EmailTemplateRepository => _emailTemplateRepository ??
                                                                           new GenericRepository<EmailTemplate>(_context);

        public IRepository<Store> StoreRepository => _storeRepository ??
                                                                     new GenericRepository<Store>(_context);

        public IRepository<State> StatesRepository => _statesRepository ??
                                                     new GenericRepository<State>(_context);

        public IRepository<City> CitiesRepository => _citiesRepository ??
                                                     new GenericRepository<City>(_context);

        public IRepository<Country> CountriesRepository => _countiresRepository ??
                                                     new GenericRepository<Country>(_context);

        public EntityEntry<T> Entry<T>(T entity) where T : class
        {
            return _context.Entry(entity);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

    }
}
