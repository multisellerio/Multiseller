using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Api.Models;
using MultiSellerIo.Services.Product;

namespace MultiSellerIo.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/Categories")]
    public class CategoriesController : Controller
    {
        private readonly IProductCategoryService _categoryService;

        public CategoriesController(IProductCategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories.Select(Mapper.Map<CategoryBindingModel>).ToList());
        }

        [HttpGet]
        [Route("GetById/{id}")]
        public async Task<IActionResult> GetById(long id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            return Ok(Mapper.Map<CategoryBindingModel>(category));
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody]Category model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var category = await _categoryService.AddCategoryAsync(model);
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Put([FromBody]Category model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var category = await _categoryService.EditCategoriesAsync(model);
            return Ok();
        }

        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            await _categoryService.DeleteAsync(id);
            return Ok();
        }
    }
}