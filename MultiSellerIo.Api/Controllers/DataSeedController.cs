using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using MultiSellerIo.Dal.Entity;

namespace MultiSellerIo.Api.Controllers
{
    [Produces("application/json")]
    [Route("api/DataSeed")]
    public class DataSeedController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<Role> _roleManager;

        public DataSeedController(UserManager<User> userManager, RoleManager<Role> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        // add sample data to database
        public async Task<string> Start()
        {
            try
            {
                // adding roles
                if (!(await _roleManager.RoleExistsAsync("SuperAdmin")))
                {
                    await _roleManager.CreateAsync(new Role() { Name = "SuperAdmin" });
                }

                // adding users
                if ((await _userManager.FindByNameAsync("SuperAdmin")) == null)
                {
                    var user = new User()
                    {
                        UserName = "SuperAdmin",
                        Email = "superadmin@testmail.com"
                    };
                    await _userManager.CreateAsync(user, "1234Qwer@");

                    await _userManager.AddToRoleAsync(user, "SuperAdmin");
                }
                return "Sample data added successfully.";
            }
            catch (Exception ex)
            {
                return "ERROR - Sample Data adding Failed. " + ex.Message;
            }
        }
    }
}