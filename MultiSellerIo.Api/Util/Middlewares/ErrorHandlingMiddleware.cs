using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using MultiSellerIo.Core.Exception;
using Newtonsoft.Json;

namespace MultiSellerIo.Api.Util.Middlewares
{
    public class ErrorHandlingMiddleware
    {
        private readonly RequestDelegate next;

        public ErrorHandlingMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await next(context);
            }
            catch (ServiceException ex)
            {
                await HandleExceptionAsync(context, ex);
            }
            catch (Exception ex)
            {
               //Todo log the exception
                await HandleExceptionAsync(context, new Exception("Internal server error, Please report the issue to us"));
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var code = HttpStatusCode.InternalServerError; // 500 if unexpected

            if (exception is ServiceException) code = HttpStatusCode.BadRequest;

            var result = JsonConvert.SerializeObject(new { error = exception.Message });

            if (!context.Response.HasStarted)
            {
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)code;
            }

            return context.Response.WriteAsync(result);
        }
    }
}
