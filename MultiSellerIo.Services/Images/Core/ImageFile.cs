using System.IO;

namespace MultiSellerIo.Services.Images.Core
{
    public class ImageFile
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public Stream Stream { get; set; }
    }
}