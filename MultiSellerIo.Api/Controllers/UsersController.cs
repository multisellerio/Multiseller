using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MultiSellerIo.Api.Models;
using MultiSellerIo.Api.Util;
using MultiSellerIo.Api.Util.Configurations.Options;
using MultiSellerIo.Api.Util.Filters;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Services.User;

namespace MultiSellerIo.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly IUserService _userService;
        private readonly TokenConfiguration _tokenConfiguration;

        public UsersController(IUserService userService, IOptions<TokenConfiguration> tokenConfiguration)
        {
            _userService = userService;
            _tokenConfiguration = tokenConfiguration.Value;
        }

        [HttpGet]
        [MultiSellerAuthorization]
        public async Task<IActionResult> GetUser()
        {
            var user = await _userService.GetUser(User);
            return Ok(Mapper.Map<UserResponseBindingModel>(user));
        }

        [HttpPost("Register")]
        [ModelValidation]
        public async Task<IActionResult> Register([FromBody]UserRegisterBindingModel model)
        {
            var user = await _userService.RegisterUser(new User()
            {
                Email = model.Email,
                UserName = model.Username,
            }, model.Password, UserService.UserRole);

            return Ok(Mapper.Map<UserResponseBindingModel>(user));
        }

        [HttpPost("Login")]
        [ModelValidation]
        public async Task<IActionResult> Login([FromBody] LoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.Login(model.Username, model.Password);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenConfiguration.Key));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(_tokenConfiguration.Issuer,
                _tokenConfiguration.Issuer,
                claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return Ok(new {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = Mapper.Map<UserResponseBindingModel>(user)
            });
        }

    }
}