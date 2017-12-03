using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

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

                image.Mutate(img => img.Resize(new ResizeOptions()
                {
                    Size = new SixLabors.Primitives.Size(width, height),
                    Mode = ResizeMode.Pad,
                }).BackgroundColor(Rgba32.White));

                image.SaveAsJpeg(outputStream);
            }

            outputStream.Position = 0;

            return outputStream;
        }
    }
}
