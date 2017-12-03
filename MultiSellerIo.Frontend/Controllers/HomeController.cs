using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace MultiSellerIo.FrontEnd.Controllers
{
    public class HomeController : Controller
    {
        private readonly IConfiguration _configuration;
        public HomeController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public IActionResult Index()
        {

            if (Request.Path.HasValue && Request.Path.Value.ToLower().Contains("external-login"))
            {
                var queryToken = Request.Query["token"];
                ViewBag.Token = queryToken;
                ViewBag.Api = _configuration["ApiUrl"];
                ViewBag.Cdn = _configuration["CdnUrl"];
                Response.Cookies.Append("ms-token", queryToken);
                return View();
            }

            var token = Request.Cookies["ms-token"];
            ViewBag.Token = token;
            ViewBag.Api = _configuration["ApiUrl"];
            ViewBag.Cdn = _configuration["CdnUrl"];

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
