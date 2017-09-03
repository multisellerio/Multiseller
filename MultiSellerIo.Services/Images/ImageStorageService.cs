using System;
using System.IO;
using System.Threading.Tasks;
using MultiSellerIo.Core.Exception;
using MultiSellerIo.Core.Interfaces;
using MultiSellerIo.Services.Images.Core;

namespace MultiSellerIo.Services.Images
{
    public interface IImageStorageService
    {
        Task<string> UploadImage(ImageFile file, bool useFilename = false);
        Task<StorageFile> GetImage(string fileName);
        Task<bool> ImageExists(string fileName);
    }

    public class ImageStorageService : IImageStorageService
    {
        private readonly IStorageService _storageService;

        public ImageStorageService(IStorageService storageService)
        {
            _storageService = storageService;
        }

        public async Task<string> UploadImage(ImageFile file, bool useFilename = false)
        {
            try
            {
                //Get the extension of file
                var extension = Path.GetExtension(file.FileName);
                var fileName = useFilename? file.FileName : $"{Guid.NewGuid()}{extension}";

                var uploadedUrl = await _storageService.Upload(fileName, file.ContentType, file.Stream);
                return uploadedUrl;
            }
            catch (Exception e)
            {
                throw new Exception("Unable to upload image", e);
            }
        }

        public async Task<StorageFile> GetImage(string fileName)
        {
            try
            {
                return await _storageService.Get(fileName);
            }
            catch (Exception e)
            {
                throw new ServiceException(e.Message, e);
            }
        }

        public async Task<bool> ImageExists(string fileName)
        {
            return await _storageService.IsExists(fileName);
        }
    }
}
