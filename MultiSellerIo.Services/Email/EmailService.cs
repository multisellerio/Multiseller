using System.Net;
using System.Threading.Tasks;
using MultiSellerIo.Services.Email.Core;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace MultiSellerIo.Services.Email
{

    public interface IEmailService
    {
        Task SendMail(OutgoingEmail outgoingEmail);
    }

    public class EmailService : IEmailService
    {
        private readonly string _sendGridApiKey;
        public EmailService(string sendGridApiKey)
        {
            _sendGridApiKey = sendGridApiKey;
        }
        public async Task SendMail(OutgoingEmail outgoingEmail)
        {
            var client = new SendGridClient(_sendGridApiKey);

            var message = new SendGridMessage
            {
                Subject = outgoingEmail.Subject,
                HtmlContent = outgoingEmail.Body
            };

            message.SetFrom(outgoingEmail.From);
            message.AddTo(outgoingEmail.To);

            await client.SendEmailAsync(message);
        }
    }
}
