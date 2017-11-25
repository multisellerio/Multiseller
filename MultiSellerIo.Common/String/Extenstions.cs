using System.Globalization;

namespace MultiSellerIo.Common.String
{
    public static class Extenstions
    {
        public static string ToTitleCase(this string value)
        {
            return CultureInfo.CurrentCulture.TextInfo.ToTitleCase(value.ToLower());
        }
    }
}
