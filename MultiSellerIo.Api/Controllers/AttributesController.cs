using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MultiSellerIo.Api.Models;
using MultiSellerIo.Api.Util;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Services.Product;
using System.Linq;
using System.Threading.Tasks;

namespace MultiSellerIo.Api.Controllers
{
    [MultiSellerAuthorization]
    [Produces("application/json")]
    [Route("api/Attributes")]
    public class AttributesController : Controller
    {
        private readonly IProductAttributeService _productAttributeService;

        public AttributesController(IProductAttributeService productAttributeService)
        {
            _productAttributeService = productAttributeService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var productAttributes = await _productAttributeService.GetProductAttributesAsync();
            return Ok(productAttributes.Select(Mapper.Map<ProductAttributeBindingModel>).ToList());
        }

        [HttpGet]
        [Route("GetById/{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var productAttribute = await _productAttributeService.GetByIdAsync(id);
            return Ok(Mapper.Map<ProductAttributeBindingModel>(productAttribute));
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody]ProductAttributeBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var productAttribute = await _productAttributeService.AddAttributeAsync(Mapper.Map<ProductAttribute>(model));
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody]ProductAttributeBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var productAttribute = await _productAttributeService.EditAttributeAsync(Mapper.Map<ProductAttribute>(model));
            return Ok();
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            await _productAttributeService.DeleteAsync(id);
            return Ok();
        }
    }
}