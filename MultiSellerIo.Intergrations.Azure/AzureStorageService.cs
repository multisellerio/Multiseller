using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using MultiSellerIo.Core.Interfaces;

namespace MultiSellerIo.Intergrations.Azure
{
    public class AzureStorageService : IStorageService
    {
        private CloudBlobContainer _container;

        public AzureStorageService(string connectionString, string container)
        {
            var storageAccount = CloudStorageAccount.Parse(connectionString);
            var blobClient = storageAccount.CreateCloudBlobClient();

            var containerReference = blobClient.GetContainerReference(container);
            containerReference.CreateIfNotExistsAsync().Wait();

            containerReference.SetPermissionsAsync(new BlobContainerPermissions()
            {
                PublicAccess = BlobContainerPublicAccessType.Container
            }).Wait();

            _container = containerReference;
        }

        public async Task<string> Upload(string filename, string contentType, Stream fileStream)
        {
            var block = _container.GetBlockBlobReference(filename);

            await block.UploadFromStreamAsync(fileStream);

            block.Properties.ContentType = contentType;
            await block.SetPropertiesAsync();

            return block.Name;
        }

        public async Task<bool> IsExists(string filename)
        {
            var block = _container.GetBlockBlobReference(filename);
            return await block.ExistsAsync();
        }

        public async Task<bool> Delete(string filename)
        {
            var block = _container.GetBlockBlobReference(filename);
            return await block.DeleteIfExistsAsync();
        }

        public async Task<StorageFile> Get(string filename)
        {
            var block = _container.GetBlockBlobReference(filename);
            
            if (!await block.ExistsAsync())
            {
                throw new Exception($"{filename} does not exists");
            }

            var fileStream = new MemoryStream();
            await block.DownloadToStreamAsync(fileStream);

            fileStream.Position = 0;

            return new StorageFile()
            {
                Stream = fileStream,
                ContentType = block.Properties.ContentType,
                FileName = filename
            };
        }
    }
}
