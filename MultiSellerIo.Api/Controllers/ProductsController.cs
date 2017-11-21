using System.Linq;
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
        [Route("GetById/{id}")]
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