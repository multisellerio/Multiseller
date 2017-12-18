using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using MultiSellerIo.Api.Models;
using MultiSellerIo.Api.Util;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Services.Store;
using MultiSellerIo.Services.User;

namespace MultiSellerIo.Api.Controllers
{
    [Route("api/Store")]
    [MultiSellerAuthorization]
    public class StoreController : Controller
    {
        private readonly IStoreService _storeService;
        private readonly IUserService _userService;

        public StoreController(IStoreService storeService, IUserService userService)
        {
            _storeService = storeService;
            _userService = userService;
        }

        [HttpPost]
        public async Task<IActionResult> AddOrUpdate([FromBody]CreateOrUpdateStoreBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var store = Mapper.Map<Store>(model);

            var user = await _userService.GetUser(User);
            store.UserId = user.Id;

            var createdOrUpdatedStore = await _storeService.AddOrUpdateStore(store);
            return Ok(Mapper.Map<StoreBindingModel>(createdOrUpdatedStore));
        }
    }
}