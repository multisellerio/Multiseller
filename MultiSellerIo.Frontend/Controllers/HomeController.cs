using Microsoft.AspNetCore.Mvc;

namespace MultiSellerIo.FrontEnd.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
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
