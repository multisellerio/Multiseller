using System.Linq;
using System.Web;
using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace MultiSellerIo.Api.Util.Filters
{
    public class ArrayInputAttribute : ActionFilterAttribute
    {
        private readonly string _parameterName;
        private readonly Type _type;

        public ArrayInputAttribute(string parameterName, Type type)
        {
            _parameterName = parameterName;
            Separator = ',';
            _type = type;
        }

        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
            if (actionContext.ActionArguments.ContainsKey(_parameterName))
            {
                string parameters = string.Empty;
                if (actionContext.RouteData.Values.ContainsKey(_parameterName))
                    parameters = (string)actionContext.RouteData.Values[_parameterName];
                else if (actionContext.HttpContext.Request.Query.ContainsKey(_parameterName))
                    parameters = actionContext.HttpContext.Request.Query[_parameterName];

                if(string.IsNullOrWhiteSpace(parameters) || string.IsNullOrEmpty(parameters))
                {
                    return;
                }

                var values = parameters.Split(Separator);

                if (_type.Name == "Int64")
                {
                    actionContext.ActionArguments[_parameterName] = values.Select(long.Parse).ToArray();
                    return;
                }

                actionContext.ActionArguments[_parameterName] = values.ToArray();


            }
        }

        public char Separator { get; set; }
    }
}
