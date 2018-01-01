using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MultiSellerIo.Services.User;
using AutoMapper;
using MultiSellerIo.Api.Models;
using System.Linq;

namespace MultiSellerIo.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/Users")]
    public class UsersController : Controller
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var users = await _userService.GetAllUsersExceptAdminAsync();
            return Ok(users.Select(Mapper.Map<UserResponseBindingModel>).ToList());
        }
    }
}