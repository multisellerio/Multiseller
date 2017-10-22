using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MultiSellerIo.Common.Pagination;
using MultiSellerIo.Common.Util;
using MultiSellerIo.Core.Exception;
using MultiSellerIo.Dal.Repository;

namespace MultiSellerIo.Services.Product
{
    public interface IProductService
    {
        Task<Dal.Entity.Product> AddProduct(Dal.Entity.Product product);
        Task<PaginationResult<ProductModel>> GetProductsAsync(ProductQuery query);
    }

    public class ProductQuery
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public string SearchText { get; set; }
        public long? CategoryId { get; set; }
        public long UserId { get; set; }
    }

    public class ProductModel
    {
        public long Id { get; set; }
        public string Slug { get; set; }
        public long CategoryId { get; set; }
        public string CategoryName { get; set; }
        public string Title{ get; set; }
        public string Description { get; set; }
        public string Vendor { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public List<string> Images { get; set; }

    }

    public class ProductService : IProductService
    {
        private readonly IUnitOfWork _unitOfWork;

        public ProductService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<PaginationResult<ProductModel>> GetProductsAsync(ProductQuery query)
        {

            Expression<Func<Dal.Entity.Product, bool>> productQuery = product =>
                product.UserId == query.UserId && !product.IsDeleted;

            if (!string.IsNullOrEmpty(query.SearchText))
            {
                Expression<Func<Dal.Entity.Product, bool>> searchTextQuery =
                    product => product.Title.ToLower().Contains(query.SearchText);

                productQuery = productQuery.And(searchTextQuery);
            }

            if (query.CategoryId.HasValue)
            {
                var categoryId = query.CategoryId.Value;
                Expression<Func<Dal.Entity.Product, bool>> categoryFilter = product => product.CategoryId == categoryId;

                productQuery = productQuery.And(categoryFilter);
            }

            var count = await _unitOfWork.ProductRepository.GetAll()
                .Where(productQuery)
                .CountAsync();

            var result = await _unitOfWork.ProductRepository.GetAll()
                .Where(productQuery)
                .Skip((query.Page - 1) * query.PageSize)
                .Take(query.PageSize)
                .Include(product => product.Images)
                .Include(product => product.Category)
                .Include(product => product.ProductVariants)
                .Select(product => new ProductModel()
                {
                    Id = product.Id,
                    CategoryId = product.CategoryId,
                    CategoryName = product.Category.Name,
                    Slug = product.Slug,
                    Title = product.Title,
                    Description = product.Description,
                    Vendor = product.Vendor,
                    Price = product.ProductVariants.Min(variation => variation.Price),
                    Quantity = product.ProductVariants.Sum(variant => variant.Quantity),
                    Images = product.Images.Select(img => img.Name).ToList()
                }).ToListAsync();

            return new PaginationResult<ProductModel>(count, query.Page, query.PageSize, result);
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
