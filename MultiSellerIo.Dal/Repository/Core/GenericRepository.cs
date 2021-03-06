﻿using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace MultiSellerIo.Dal.Repository.Core
{
    public class GenericRepository<T> : IRepository<T> where T : class
    {
        protected readonly IMultiSellerIoContext _context;
        protected DbSet<T> _dbSet;

        public GenericRepository(IMultiSellerIoContext context)
        {
            _context = context;
            _dbSet = context.Set<T>();
        }

        public async Task Add(T entity)
        {
            await _dbSet.AddAsync(entity);
        }

        public async Task<T> Get<TKey>(TKey id)
        {
            return await _dbSet.FindAsync(id);
        }

        public EntityEntry<T> Entry(T entity)
        {
            return _context.Entry(entity);
        }

        public IQueryable<T> GetAllAsQueryable()
        {
            return _dbSet;
        }

        public void Update(T entity)
        {
            _context.Update(entity);
        }

        public EntityState GetState(T entity)
        {
            return _context.Entry(entity).State;
        }

        public async Task Remove<TKey>(TKey id)
        {
            var entity = await Get(id);
            _dbSet.Remove(entity);
        }

        public void SetCurrentValues(T entity, object valueObject)
        {
            _context.Entry(entity).CurrentValues.SetValues(valueObject);
        }

    }
}
