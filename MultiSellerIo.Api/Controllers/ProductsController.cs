﻿using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MultiSellerIo.Api.Models;
using MultiSellerIo.Api.Util;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Services.Product;
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

        public ProductsController(IProductAttributeService productAttributeService, IProductCategoryService productCategoryService,
            IProductService productService, IUserService userService)
        {
            _productAttributeService = productAttributeService;
            _productCategoryService = productCategoryService;
            _productService = productService;
            _userService = userService;
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

        [HttpGet]
        [Route("meta")]
        public async Task<IActionResult> GetProductMetaData()
        {
            var productAttributes = await _productAttributeService.GetProductAttributes();
            var categories = await _productCategoryService.GetCategories();

            return Ok(new ProductMetaDataModel()
            {
                ProductAttributes = productAttributes.Select(Mapper.Map<ProductAttributeBindingModel>).ToList(),
                Categories = categories.Select(Mapper.Map<CategoryBindingModel>).ToList()
            });
        }
    }
}