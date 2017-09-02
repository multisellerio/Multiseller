using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using MultiSellerIo.Core.Exception;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Dal.Repository;

namespace MultiSellerIo.Services.User
{
    public interface IUserService
    {
        Task<Dal.Entity.User> RegisterUser(Dal.Entity.User user, string password, string role);
        Task<Dal.Entity.User> RegisterUser(Dal.Entity.User user, ExternalLoginInfo externalLoginInfo, string role);
        Task<Dal.Entity.User> Login(string username, string password);
        Task<bool> IsInRole(Dal.Entity.User user, string role);
        long GetUserId(ClaimsPrincipal user);
        Task<Dal.Entity.User> GetUser(ClaimsPrincipal user);
        Task InitialRoles();
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

        public async Task<Dal.Entity.User> RegisterUser(Dal.Entity.User user, ExternalLoginInfo externalLoginInfo, string role)
        {
            using (var transaction = await _unitOfWork.GetTransaction())
            {
                try
                {
                    var userCreatedResult = await _userManager.CreateAsync(user);

                    if (!userCreatedResult.Succeeded)
                    {
                        throw new ServiceException(GenerateMessage(userCreatedResult));
                    }

                    var addLoginResult = await _userManager.AddLoginAsync(user, externalLoginInfo);

                    if (!addLoginResult.Succeeded)
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

        public async Task<bool> IsInRole(Dal.Entity.User user, string role)
        {
            return await _userManager.IsInRoleAsync(user, role);
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
