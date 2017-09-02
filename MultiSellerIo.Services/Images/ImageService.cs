using System;
using System.IO;
using System.Threading.Tasks;
using MultiSellerIo.Core.Exception;
using MultiSellerIo.Core.Interfaces;
using MultiSellerIo.Services.Images.Core;

namespace MultiSellerIo.Services.Images
{
    public interface IImageService
    {
        Task<StorageFile> GetImage(string fileName);
        Task<StorageFile> GetImage(string fileName, int width, int height);
        Task<string> UploadImage(ImageFile imageFile);
    }

    public class ImageService : IImageService
    {
        private readonly IImageStorageService _imageStorageService;
        private readonly IImageResizeService _imageResizeService;

        public ImageService(IImageStorageService imageStorageService, IImageResizeService imageResizeService)
        {
            _imageStorageService = imageStorageService;
            _imageResizeService = imageResizeService;
        }

        public async Task<StorageFile> GetImage(string fileName)
        {
            try
            {
                return await _imageStorageService.GetImage(fileName);
            }
            catch (Exception e)
            {
                throw new ServiceException($"Unable to get {fileName}", e);
            }
        }

        public async Task<StorageFile> GetImage(string fileName, int width, int height)
        {
            try
            {
                var resizedFileName = $"{Path.GetFileNameWithoutExtension(fileName)}_{width}_{height}{Path.GetExtension(fileName)}";

                //If exists cached resized file return it

                if (await _imageStorageService.ImageExists(resizedFileName))
                {
                    return await _imageStorageService.GetImage(resizedFileName);
                }

                //If not exists cached resize file, generate it and store it

                var file = await _imageStorageService.GetImage(fileName);
                var resizeStream = _imageResizeService.ResizeImage(width, height, file.Stream);

                await _imageStorageService.UploadImage(new ImageFile()
                {
                    Stream = resizeStream,
                    ContentType = file.ContentType,
                    FileName = resizedFileName
                }, true);

                resizeStream.Position = 0;

                file.Stream = resizeStream;

                return file;
            }
            catch (Exception e)
            {
                throw new ServiceException($"Unable to process {fileName}", e);
            }
        }

        public async Task<string> UploadImage(ImageFile imageFile)
        {
            return await _imageStorageService.UploadImage(imageFile);
        }
    }
}
