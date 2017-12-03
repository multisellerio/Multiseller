using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MultiSellerIo.Services.Images;

namespace MultiSellerIo.FrontEnd.Controllers
{
    [Route("assets/images")]
    public class ImageController : Controller
    {
        private readonly IImageService _imageService;
        public ImageController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpGet("{filename}")]
        [ResponseCache(Duration = 60 * 60 * 24 * 14)]
        public async Task<IActionResult> Get(string fileName)
        {
            var file = await _imageService.GetImage(fileName);
            return File(file.Stream, file.ContentType);
        }

        [HttpGet("{height}/{width}/{filename}")]
        [ResponseCache(Duration = 60 * 60 * 24 * 14)]
        public async Task<IActionResult> Get(int height, int width, string fileName)
        {
            var file = await _imageService.GetImage(fileName, width, height);
            return File(file.Stream, file.ContentType);
        }
    }
}