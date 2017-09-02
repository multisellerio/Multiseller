using System.IO;
using ImageSharp;
using ImageSharp.Formats;
using ImageSharp.Processing;

namespace MultiSellerIo.Services.Images
{
    public interface IImageResizeService
    {
        Stream ResizeImage(int width, int height, Stream imageStream);
    }

    public class ImageResizeService : IImageResizeService
    {
        public Stream ResizeImage(int width, int height, Stream imageStream)
        {
            var outputStream = new MemoryStream();

            using (Image<Rgba32> image = Image.Load<Rgba32>(imageStream))
            {
                image.Resize(new ResizeOptions()
                {
                    Size = new SixLabors.Primitives.Size(width, height),
                    Mode = ResizeMode.Max
                }).SaveAsJpeg(outputStream, new JpegEncoder()
                {
                    Quality = 100
                });
            }

            outputStream.Position = 0;

            return outputStream;
        }
    }
}
