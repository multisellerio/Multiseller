using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MultiSellerIo.Api.Models;
using MultiSellerIo.Api.Util;
using MultiSellerIo.Api.Util.Configurations.Options;
using MultiSellerIo.Api.Util.Filters;
using MultiSellerIo.Core.Exception;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Services.User;

namespace MultiSellerIo.Api.Controllers
{
    [MultiSellerAuthorization]
    public class AccountController : Controller
    {
        private readonly SignInManager<User> _signInManager;
        private readonly IUserService _userService;
        private readonly TokenConfiguration _tokenConfiguration;
        private readonly FacebookConfiguration _facebookConfiguration;

        public AccountController(IUserService userService, IOptions<TokenConfiguration> tokenConfiguration,
            IOptions<FacebookConfiguration> facebookConfiguration, SignInManager<User> signInManager)
        {
            _userService = userService;
            _tokenConfiguration = tokenConfiguration.Value;
            _signInManager = signInManager;
            _facebookConfiguration = facebookConfiguration.Value;
        }

        [Route("api/account/get-external-signin-meta")]
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetExternalSigninMeta([FromServices]string uiHost)
        {
            var hostUrl = $"{Request.Scheme}://{Request.Host}";
            var retrunUrl = $"{uiHost}/external-login";
            var facebookAuthUrl = $"{hostUrl}/account/external-login?provider=Facebook&returnUrl={retrunUrl}";
            var twitterAuthUrl = $"{hostUrl}/account/external-login?provider=Twitter&returnUrl={retrunUrl}";
            var googleAuthUrl = $"{hostUrl}/account/external-login?provider=Google&returnUrl={retrunUrl}";

            return Ok(new
            {
                FacebookAuthUrl = facebookAuthUrl,
                TwitterAuthUrl = twitterAuthUrl,
                GoogleAuthUrl = googleAuthUrl
            });
        }

        [Route("api/account/get-user")]
        [HttpGet]
        [MultiSellerAuthorization]
        public async Task<IActionResult> GetUser()
        {
            var user = await _userService.GetUser(User);
            return Ok(Mapper.Map<UserBindingModel>(user));
        }

        [Route("api/account/register")]
        [HttpPost]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody]UserRegisterBindingModel model)
        {
            var user = await _userService.RegisterUser(new User()
            {
                Email = model.Email,
                UserName = model.Username,
            }, model.Password, UserService.UserRole);

            return Ok(Mapper.Map<UserBindingModel>(user));
        }

        [Route("api/account/login")]
        [HttpPost]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.Login(model.Username, model.Password);

            var token = GenerateToken(user);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                user = Mapper.Map<UserBindingModel>(user)
            });
        }

        [Route("api/account/send-email-confirmation")]
        [HttpPost]
        public async Task<IActionResult> SendEmailConfirmation([FromServices]string uiHost)
        { 
            var retrunUrl = $"{uiHost}/email-confirm";
            var user = await _userService.GetUser(User);
            await _userService.SendEmailConfirmationEmail(user, retrunUrl);
            return Ok();
        }

        [Route("api/account/email-confirmation")]
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> EmailConfirmation([FromBody]EmailConfirmationBindingModel model)
        {
            await _userService.ConfirmEmail(model.Email, model.Token);
            return Ok();
        }

        [Route("api/account/forget-password")]
        [HttpPost]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> ForgetPassword([FromServices]string uiHost, [FromBody]ResetPasswordRequestBindingModel model)
        {
            await _userService.ForgotPassword($"{uiHost}/account/reset-password", model.Email);
            return Ok();
        }

        [Route("api/account/reset-password")]
        [HttpPost]
        [ModelValidation]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody]ResetPasswordBindingModel model)
        {
            await _userService.ResetPassword(model.Email, model.Token, model.Password);
            return Ok();
        }

        [AllowAnonymous]
        [Route("account/external-login")]
        [HttpGet]
        public IActionResult GetExternalLogin(string provider, string returnUrl)
        {
            var redirectUrl = Url.Action("RegisterExternal", values: new { returnUrl });
            var properties = _signInManager.ConfigureExternalAuthenticationProperties(provider, redirectUrl);
            return new ChallengeResult(provider, properties);
        }

        [AllowAnonymous]
        [Route("account/register-external")]
        [HttpGet]
        public async Task<IActionResult> RegisterExternal(string returnUrl)
        {
            var externalAuth = await _signInManager.GetExternalLoginInfoAsync();

            var emailClaim = externalAuth.Principal.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Email);

            if (emailClaim == null)
            {
                throw new ServiceException("Email is required");
            }

            var user = new User()
            {
                UserName = emailClaim.Value,
                Email = emailClaim.Value
            };

            var registeredUser = await _userService.RegisterUser(user, externalAuth, UserService.UserRole);

            var token = GenerateToken(registeredUser);

            var parametersToAdd = new System.Collections.Generic.Dictionary<string, string> { { "token", new JwtSecurityTokenHandler().WriteToken(token) } };
            var returnUrlWithToken = Microsoft.AspNetCore.WebUtilities.QueryHelpers.AddQueryString(returnUrl, parametersToAdd);

            return Redirect(returnUrlWithToken);
        }

        private JwtSecurityToken GenerateToken(User user)
        {
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

            return token;
        }


    }
}