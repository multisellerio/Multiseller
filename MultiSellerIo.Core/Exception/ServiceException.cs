namespace MultiSellerIo.Core.Exception
{
    public class ServiceException : System.Exception
    {
        public ServiceException(string message) : base(message)
        {
        }

        public ServiceException(string message, System.Exception exception) : base(message, exception)
        {
        }
    }
}
