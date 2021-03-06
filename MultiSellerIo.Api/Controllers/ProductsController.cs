﻿using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MultiSellerIo.Api.Models;
using MultiSellerIo.Api.Util;
using MultiSellerIo.Api.Util.Filters;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Services.Product;
using MultiSellerIo.Services.Product.Core;
using MultiSellerIo.Services.User;

namespace MultiSellerIo.Api.Controllers
{
    [Route("api/Products")]
    [MultiSellerAuthorization]
    public class ProductsController : Controller
    {
        private readonly IProductAttributeService _productAttributeService;
        private readonly IProductCategoryService _productCategoryService;
        private readonly IProductService _productService;
        private readonly IUserService _userService;
        private readonly IProductAttributeSeparateService _productAttributeSeparateService;

        public ProductsController(IProductAttributeService productAttributeService, 
            IProductCategoryService productCategoryService,
            IProductAttributeSeparateService productAttributeSeparateService,
            IProductService productService, IUserService userService)
        {
            _productAttributeService = productAttributeService;
            _productCategoryService = productCategoryService;
            _productService = productService;
            _userService = userService;
            _productAttributeSeparateService = productAttributeSeparateService;
        }

        [HttpGet]
        public async Task<IActionResult> Get(ProductQueryModel model)
        {
            var user = await _userService.GetUser(User);

            var result = await _productService.GetProductsAsync(new ProductQuery()
            {
                Page = model.Page,
                PageSize = model.PageSize,
                CategoryId = model.CategoryId,
                SearchText = model.SearchText,
                UserId = user.Id
            });

            return Ok(result);
        }

        [HttpGet]
        [Route("search")]
        [ArrayInput("attributeValues", typeof(long))]
        [ArrayInput("vendors", typeof(string))]
        [AllowAnonymous]
        public async Task<IActionResult> Search(string[] vendors, long[] attributeValues,
            [FromQuery]ProductSearchBindingModel model)
        {
            var category = await _productCategoryService.GetBySlug(model.Category);

            var separatedAttributeValues = await _productAttributeSeparateService.SeparateAttributeValues(category.Id, attributeValues);

            var result = await _productService.SearchProductAsync(new SearchProductCriteria()
            {
                PageSize = model.PageSize,
                Page = model.Page,
                AttributeValues = separatedAttributeValues.AttributeValues,
                SpecificationAttirbuteValues = separatedAttributeValues.SpecificationAttributeValues,
                Category = model.Category,
                SearchText = model.SearchText,
                PriceMin = model.PriceMin,
                PriceMax = model.PriceMax,
                Vendors = vendors
            });
            return Ok(result);
        }

        [HttpGet]
        [Route("GetById/{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(long id)
        {
            var product = await _productService.GetById(id);
            return Ok(Mapper.Map<ProductBindingModel>(product));
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]ProductBindingModel model)
        {
            var user = await _userService.GetUser(User);

            var requestProduct = Mapper.Map<Product>(model);
            requestProduct.UserId = user.Id;

            var product = await _productService.AddProduct(requestProduct);

            return Ok(Mapper.Map<ProductBindingModel>(product));
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody]ProductBindingModel model)
        {
            var user = await _userService.GetUser(User);

            var requestProduct = Mapper.Map<Product>(model);
            requestProduct.UserId = user.Id;

            var product = await _productService.UpdateProduct(requestProduct);

            return Ok(Mapper.Map<ProductBindingModel>(product));
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            var user = await _userService.GetUser(User);
            await _productService.Delete(id, user.Id);
            return Ok();
        }

        [HttpGet]
        [Route("meta")]
        [AllowAnonymous]
        public async Task<IActionResult> GetProductMetaData()
        {
            var productAttributes = await _productAttributeService.GetProductAttributesAsync();
            var categories = await _productCategoryService.GetCategoriesAsync();

            return Ok(new ProductMetaDataModel()
            {
                ProductAttributes = productAttributes.Select(Mapper.Map<ProductAttributeBindingModel>).ToList(),
                Categories = categories.Select(Mapper.Map<CategoryBindingModel>).ToList()
            });
        }
    }
}