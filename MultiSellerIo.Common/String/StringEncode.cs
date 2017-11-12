using System;

namespace MultiSellerIo.Common.String
{
    public class StringEncode
    {
        public static string EncodeString(string text)
        {
            byte[] encodedBytes = System.Text.Encoding.Unicode.GetBytes(text);
            return Convert.ToBase64String(encodedBytes);
        }

        public static string DecodeString(string text)
        {
            byte[] decodedBytes = Convert.FromBase64String(Convert.ToBase64String(System.Text.Encoding.Unicode.GetBytes(text)));
            return System.Text.Encoding.UTF8.GetString(decodedBytes);
        }
    }
}
