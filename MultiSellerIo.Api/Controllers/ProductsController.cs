using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MultiSellerIo.Api.Models;
using MultiSellerIo.Services.Product;

namespace MultiSellerIo.Api.Controllers
{
    [Route("api/Products")]
    public class ProductsController : Controller
    {
        private readonly IProductAttributeService _productAttributeService;
        private readonly IProductCategoryService _productCategoryService;

        public ProductsController(IProductAttributeService productAttributeService, IProductCategoryService productCategoryService)
        {
            _productAttributeService = productAttributeService;
            _productCategoryService = productCategoryService;
        }

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