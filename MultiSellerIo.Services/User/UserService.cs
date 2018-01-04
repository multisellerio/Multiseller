using System;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;
using Hangfire;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MultiSellerIo.Common.String;
using MultiSellerIo.Core.Exception;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Dal.Repository;
using MultiSellerIo.Services.Email;
using MultiSellerIo.Services.User.Core;

namespace MultiSellerIo.Services.User
{
    public interface IUserService
    {
        Task<Dal.Entity.User> RegisterUser(Dal.Entity.User user, string password, string role);
        Task<Dal.Entity.User> RegisterUser(Dal.Entity.User user, ExternalLoginInfo externalLoginInfo, string role);
        Task<Dal.Entity.User> Login(string username, string password);
        Task<bool> IsInRole(Dal.Entity.User user, string role);
        Task ResetPassword(string email, string token, string password);
        long GetUserId(ClaimsPrincipal user);
        Task ForgotPassword(string returnUrl, string email);
        Task SendEmailConfirmationEmail(Dal.Entity.User user, string returnUrl);
        Task ConfirmEmail(string email, string token);
        Task<Dal.Entity.User> GetUser(ClaimsPrincipal user);
        Task InitialRoles();
        Task<Dal.Entity.User> UpdateProfile(long userId, UpdateProfileData data);
    }

    public class UserService : IUserService
    {
        public const string UserRole = "UserRole";

        private readonly UserManager<Dal.Entity.User> _userManager;
        private readonly RoleManager<Role> _roleManager;
        private readonly IUnitOfWork _unitOfWork;

        public UserService(IUnitOfWork unitOfWork, UserManager<Dal.Entity.User> userManager, RoleManager<Role> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _unitOfWork = unitOfWork;
        }

        public async Task<Dal.Entity.User> RegisterUser(Dal.Entity.User user, string password, string role)
        {
            using (var transaction = await _unitOfWork.GetTransaction())
            {
                try
                {
                    var userCreatedResult = await _userManager.CreateAsync(user, password);

                    if (!userCreatedResult.Succeeded)
                    {
                        throw new ServiceException(GenerateMessage(userCreatedResult));
                    }

                    var addRoleResult = await _userManager.AddToRoleAsync(user, role);

                    if (!addRoleResult.Succeeded)
                    {
                        throw new ServiceException(GenerateMessage(addRoleResult));
                    }

                    transaction.Commit();

                    return user;
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

        public async Task<Dal.Entity.User> RegisterUser(Dal.Entity.User user, string role, UserLoginInfo userLoginInfo)
        {
            using (var transaction = await _unitOfWork.GetTransaction())
            {
                try
                {
                    var userCreatedResult = await _userManager.AddLoginAsync(user, userLoginInfo);

                    if (!userCreatedResult.Succeeded)
                    {
                        throw new ServiceException(GenerateMessage(userCreatedResult));
                    }

                    var addRoleResult = await _userManager.AddToRoleAsync(user, role);

                    if (!addRoleResult.Succeeded)
                    {
                        throw new ServiceException(GenerateMessage(addRoleResult));
                    }

                    transaction.Commit();

                    return user;
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

        public async Task<Dal.Entity.User> RegisterUser(Dal.Entity.User user, ExternalLoginInfo externalLoginInfo, string role)
        {
            using (var transaction = await _unitOfWork.GetTransaction())
            {
                try
                {
                    Dal.Entity.User currentUser = null;

                    currentUser = await _userManager.FindByEmailAsync(user.Email);

                    if (currentUser == null)
                    {
                        var userCreatedResult = await _userManager.CreateAsync(user);

                        if (!userCreatedResult.Succeeded)
                        {
                            throw new ServiceException(GenerateMessage(userCreatedResult));
                        }

                        currentUser = user;
                    }

                    var addLoginResult = await _userManager.AddLoginAsync(currentUser, externalLoginInfo);

                    if (!addLoginResult.Succeeded && addLoginResult.Errors.All(err => err.Code != "LoginAlreadyAssociated"))
                    {
                        throw new ServiceException(GenerateMessage(addLoginResult));
                    }

                    if (!await _userManager.IsInRoleAsync(currentUser, role))
                    {
                        var addRoleResult = await _userManager.AddToRoleAsync(currentUser, role);

                        if (!addRoleResult.Succeeded)
                        {
                            throw new ServiceException(GenerateMessage(addRoleResult));
                        }
                    }

                    transaction.Commit();

                    return currentUser;
                }
                catch
                {
                    transaction.Rollback();
                    throw;
                }
            }
        }

        public async Task<Dal.Entity.User> Login(string username, string password)
        {
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
            {
                throw new ServiceException("Unable to find user from username " + username);
            }

            var isSuccess = await _userManager.CheckPasswordAsync(user, password);

            if (!isSuccess)
            {
                throw new ServiceException("Invalid password");
            }

            return user;
        }

        public async Task<Dal.Entity.User> UpdateProfile(long userId, UpdateProfileData data)
        {
            var user = await GetUserById(userId);

            if (user.Email != data.Email)
            {
                user.EmailConfirmed = false;
            }

            user.FirstName = data.FirstName;
            user.LastName = data.LastName;
            user.Gender = data.Gender;
            user.Email = data.Email;
            user.ProfileImage = data.ProfileImage;

            user.UserName = data.Username;

            var updateUserResult = await _userManager.UpdateAsync(user);

            if (!updateUserResult.Succeeded)
            {
                throw new ServiceException(GenerateMessage(updateUserResult));
            }

            return user;
        }

        public async Task<Dal.Entity.User> GetUserById(long id)
        {
            var user = await _userManager.Users.Where(u => u.Id == id).FirstOrDefaultAsync();

            if (user == null)
            {
                throw new ServiceException("Unable to find user");
            }

            return user;
        }

        public async Task ForgotPassword(string returnUrl, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                throw new ServiceException("Unable to find user from email " + email);
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var url = $"{returnUrl}?token={WebUtility.UrlEncode(token)}&email={WebUtility.UrlEncode(email)}";

            //Sending email to user to reset password
            BackgroundJob.Enqueue((IEmailSendingService emailSendingService) =>
                emailSendingService.SendResetPasswordEmail(new ResetPasswordEmailDetails()
                {
                    To = user.Email,
                    ReturnUrl = url,
                    LastName = user.Email
                }));

        }

        public async Task ResetPassword(string email, string token, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                throw new ServiceException("Unable to find user from email " + email);
            }

            var resetPasswordResult = await _userManager.ResetPasswordAsync(user, token, password);

            if (!resetPasswordResult.Succeeded)
            {
                throw new ServiceException(GenerateMessage(resetPasswordResult));
            }
        }

        public async Task<bool> IsInRole(Dal.Entity.User user, string role)
        {
            return await _userManager.IsInRoleAsync(user, role);
        }

        public async Task SendEmailConfirmationEmail(Dal.Entity.User user, string returnUrl)
        {
            var emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var url = $"{returnUrl}?token={WebUtility.UrlEncode(emailConfirmationToken)}&email={WebUtility.UrlEncode(user.Email)}";

            //Sending email to user to confirm email address
            BackgroundJob.Enqueue((IEmailSendingService emailSendingService) =>
                emailSendingService.SendEmailConfirmationEmail(new EmailConfirmationEmailDetails()
                {
                    To = user.Email,
                    ReturnUrl = url,
                    LastName = user.Email
                }));
        }

        public async Task ConfirmEmail(string email, string token)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)
            {
                throw new ServiceException("Unable to find user from email " + email);
            }

            var emailConfirmationResult = await _userManager.ConfirmEmailAsync(user, token);

            if (!emailConfirmationResult.Succeeded)
            {
                throw new ServiceException(GenerateMessage(emailConfirmationResult));
            }
        }

        public long GetUserId(ClaimsPrincipal user)
        {
            var userId = _userManager.GetUserId(user);

            if (userId == null)
            {
                throw new ServiceException("Unable to find user");
            }

            return long.Parse(userId);
        }

        public async Task<Dal.Entity.User> GetUser(ClaimsPrincipal user)
        {
            var userId = GetUserId(user);
            return await _userManager.FindByIdAsync(userId.ToString());
        }

        // return all users except admins
        public async Task<IEnumerable<Dal.Entity.User>> GetAllUsersExceptAdminAsync()
        {
            return await _userManager.GetUsersInRoleAsync("UserRole");
        }

        public async Task InitialRoles()
        {
            if (!await _roleManager.RoleExistsAsync(UserRole))
            {
                await _roleManager.CreateAsync(new Role()
                {
                    Name = UserRole
                });
            }
        }

        #region Private Methods

        private string GenerateMessage(IdentityResult identityResult)
        {
            return string.Join(", ", identityResult.Errors.Select(error => error.Description));
        }

        #endregion
    }
}
