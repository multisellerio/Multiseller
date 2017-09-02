using System.IO;
using System.Threading.Tasks;

namespace MultiSellerIo.Core.Interfaces
{
    public interface IStorageService
    {
        Task<string> Upload(string filename, string contentType, Stream fileStream);
        Task<bool> IsExists(string filename);
        Task<bool> Delete(string filename);
        Task<StorageFile> Get(string filename);
    }

    public class StorageFile
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public Stream Stream { get; set; }
    }
}
