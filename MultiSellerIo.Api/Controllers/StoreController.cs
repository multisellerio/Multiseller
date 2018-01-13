using System.Linq;
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

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var user = await _userService.GetUser(User);
            var store = await _storeService.GetStoreByUserId(user.Id);

            if (store == null)
            {
                return NotFound();
            }

            return Ok(Mapper.Map<StoreBindingModel>(store));
        }

        [HttpPost]
        [Route("store-policies")]
        public async Task<IActionResult> StorePolicies([FromBody]CreateOrUpdateStoreBindingModel model)
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

        [HttpPost]
        [Route("shipping")]
        public async Task<IActionResult> Shipping([FromBody]CreateOrUpdateShippingBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var shipingCosts = model.ShippingCosts.Select(Mapper.Map<ShippingCost>).ToList();
            var user = await _userService.GetUser(User);

            var createdOrUpdatedStore = await _storeService.AddOrUpdateShipping(user.Id, shipingCosts);
            return Ok(Mapper.Map<StoreBindingModel>(createdOrUpdatedStore));
        }
    }
}