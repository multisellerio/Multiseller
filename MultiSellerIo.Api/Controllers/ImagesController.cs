using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MultiSellerIo.Services.Images;
using MultiSellerIo.Services.Images.Core;

namespace MultiSellerIo.Api.Controllers
{
    [Produces("application/json")]
    [Route("Images")]
    public class ImagesController : Controller
    {
        private readonly IImageService _imageService;
        public ImagesController(IImageService imageService)
        {
            _imageService = imageService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UplaodImages()
        {
            if (!Request.Form.Files.Any())
                return BadRequest("No files to upload");

            var fileList = new List<string>();

            foreach (var formFile in Request.Form.Files)
            {
                var filePath = await _imageService.UploadImage(new ImageFile()
                {
                    FileName = formFile.FileName,
                    ContentType = formFile.ContentType,
                    Stream = formFile.OpenReadStream()
                });

                fileList.Add(filePath);
            }

            return Json(new { FileList = fileList });
        }

    }
}