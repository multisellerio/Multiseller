using System.Linq;
using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace MultiSellerIo.Api.Util.Filters
{
    public class ModelValidationAttribute : ActionFilterAttribute
    {

        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
            if (actionContext.ModelState.IsValid) return;

            var message = actionContext.ModelState
                .SelectMany(f => f.Value.Errors)
                .Aggregate("", (current, error) => current + error.ErrorMessage);

            actionContext.Result = new BadRequestObjectResult(new
            {
                error = message
            });

        }
    }
}
