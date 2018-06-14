using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MultiSellerIo.Core.Exception;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Dal.Repository;
using Mustache;

namespace MultiSellerIo.Services.Email
{

    public interface IEmailTemplateService
    {
        Task<EmailContent> GetEmailContent(string type, IDictionary<string, string> values);
    }

    public class EmailContent
    {
        public string Subject { get; set; }
        public string Body { get; set; }
        public string From { get; set; }
    }

    public class EmailTemplateService: IEmailTemplateService
    {
        private readonly IUnitOfWork _unitOfWork;
        public EmailTemplateService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<EmailTemplate> AddTemplate(EmailTemplate template)
        {
            await _unitOfWork.EmailTemplateRepository.Add(template);
            await _unitOfWork.SaveChangesAsync();

            return template;
        }

        public async Task<EmailContent> GetEmailContent(string type, IDictionary<string, string> values)
        {
            var template = await _unitOfWork.EmailTemplateRepository.GetAllAsQueryable()
                .FirstOrDefaultAsync(entity => entity.Type == type);

            if (template == null)
            {
                throw new ServiceException("Email template not found");
            }

            return new EmailContent()
            {
                Subject = ParseTemplate(template.Subject, values),
                Body = ParseTemplate(template.Content, values),
                From = template.From
            };

        }

        private string ParseTemplate(string template, IDictionary<string, string> values)
        {
            var compiler = new FormatCompiler();
            var generator = compiler.Compile(template);
            return generator.Render(values);
        }
    }
}
