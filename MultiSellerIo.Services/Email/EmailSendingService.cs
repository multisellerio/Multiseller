using System.Collections.Generic;
using System.Threading.Tasks;
using MultiSellerIo.Common.Mail;
using MultiSellerIo.Services.Email.Core;

namespace MultiSellerIo.Services.Email
{
    public interface IEmailSendingService
    {
        Task SendResetPasswordEmail(ResetPasswordEmailDetails details);
        Task SendEmailConfirmationEmail(EmailConfirmationEmailDetails details);
    }

    public class ResetPasswordEmailDetails
    {
        public string To { get; set; }
        public string ReturnUrl { get; set; }
        public string LastName { get; set; }
    }

    public class EmailConfirmationEmailDetails
    {
        public string To { get; set; }
        public string ReturnUrl { get; set; }
        public string LastName { get; set; }
    }

    public class EmailSendingService: IEmailSendingService
    {
        private readonly IEmailTemplateService _emailTemplateService;
        private readonly IEmailService _emailService;

        public EmailSendingService(IEmailTemplateService emailTemplateService, IEmailService emailService)
        {
            _emailTemplateService = emailTemplateService;
            _emailService = emailService;
        }

        public async Task SendResetPasswordEmail(ResetPasswordEmailDetails details)
        {
            var emailContent =
                await _emailTemplateService.GetEmailContent(MailTypes.ForgetPassword, new Dictionary<string, string>()
                {
                    { "ActionUrl", details.ReturnUrl },
                    { "Name", details.LastName }
                });

            await _emailService.SendMail(new OutgoingEmail()
            {
                Subject = emailContent.Subject,
                Body = emailContent.Body,
                From = emailContent.From,
                To = details.To
            });
        }

        public async Task SendEmailConfirmationEmail(EmailConfirmationEmailDetails details)
        {
            var emailContent =
                await _emailTemplateService.GetEmailContent(MailTypes.EmailConfirmation, new Dictionary<string, string>()
                {
                    { "ActionUrl", details.ReturnUrl },
                    { "Name", details.LastName }
                });

            await _emailService.SendMail(new OutgoingEmail()
            {
                Subject = emailContent.Subject,
                Body = emailContent.Body,
                From = emailContent.From,
                To = details.To
            });
        }


    }
}
