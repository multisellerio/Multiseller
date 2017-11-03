using Microsoft.AspNetCore.Mvc;

namespace MultiSellerIo.FrontEnd.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {

            if (Request.Path.HasValue && Request.Path.Value.ToLower().Contains("external-login"))
            {
                var queryToken = Request.Query["token"];
                ViewBag.Token = queryToken;
                Response.Cookies.Append("ms-token", queryToken);
                return View();
            }

            var token = Request.Cookies["ms-token"];
            ViewBag.Token = token;

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
