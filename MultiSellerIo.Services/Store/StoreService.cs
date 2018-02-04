using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MultiSellerIo.Core.Exception;
using MultiSellerIo.Dal.Entity;
using MultiSellerIo.Dal.Repository;

namespace MultiSellerIo.Services.Store
{

    public interface IStoreService
    {
        Task<Dal.Entity.Store> AddOrUpdateStore(Dal.Entity.Store store);
        Task<Dal.Entity.Store> AddOrUpdateShipping(long userId, List<ShippingCost> shippingCosts);
        Task<Dal.Entity.Store> GetStoreByUserId(long userId);
        Task SetAsVerifiedStore(long userId);
    }

    public class StoreService : IStoreService
    {
        private readonly IUnitOfWork _unitOfWork;

        public StoreService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<Dal.Entity.Store> AddOrUpdateStore(Dal.Entity.Store store)
        {
            var storeUserId = store.UserId;
            var storeExists = await _unitOfWork.StoreRepository.GetAll().AnyAsync(storeEntity => storeEntity.UserId == storeUserId);

            if (storeExists)
            {
                //If store exists, we should update the details
                var currentStore = await GetStoreByUserId(storeUserId);

                //Set the updated store id as current store id --To ensure the update
                store.Id = currentStore.Id;
                //This will not update shipping informations
                store.ShippingCosts = currentStore.ShippingCosts;
                store.Verified = currentStore.Verified;

                if (store.StoreName != currentStore.StoreName)
                {
                    if (await _unitOfWork.StoreRepository.GetAll()
                        .Where(s => s.StoreName.ToLower() == store.StoreName.ToLower()).AnyAsync())
                    {
                        throw new ServiceException("Store name is already exists");
                    }
  
                }

                _unitOfWork.StoreRepository.SetCurrentValues(currentStore, store);

                await _unitOfWork.SaveChangesAsync();

                return store;
            }

            await _unitOfWork.StoreRepository.Add(store);
            await _unitOfWork.SaveChangesAsync();

            return store;
        }

        public async Task<Dal.Entity.Store> AddOrUpdateShipping(long userId, List<ShippingCost> shippingCosts)
        {
            var storeExists = await _unitOfWork.StoreRepository.GetAll().AnyAsync(storeEntity => storeEntity.UserId == userId);

            if (storeExists)
            {
                //If store exists, we should update the details
                var currentStore = await GetStoreByUserId(userId);
                var currentStoreShippingCosts = currentStore.ShippingCosts;

                foreach (var shippingCost in shippingCosts)
                {
                    var currentShippingCost = currentStoreShippingCosts.SingleOrDefault(s =>
                        s.ShippingCostType == shippingCost.ShippingCostType &&
                        s.CityId == shippingCost.CityId && s.CountryId == shippingCost.CountryId
                    );

                    if (currentShippingCost != null)
                    {
                        currentShippingCost.Cost = shippingCost.Cost;
                        continue;
                    }

                    currentStore.ShippingCosts.Add(shippingCost);
                }

                var removingShippingCosts = currentStoreShippingCosts.Where(currentStoreShippingCost =>
                    !shippingCosts.Any(s =>
                        s.ShippingCostType == currentStoreShippingCost.ShippingCostType &&
                        s.CityId == currentStoreShippingCost.CityId &&
                        s.CountryId == currentStoreShippingCost.CountryId)).ToList();

                foreach (var removingShippingCost in removingShippingCosts)
                {
                    currentStoreShippingCosts.Remove(removingShippingCost);
                }

                await _unitOfWork.SaveChangesAsync();

                return currentStore;
            }

            throw new ServiceException("Store does not exists");
        }

        public async Task<Dal.Entity.Store> GetStoreByUserId(long userId)
        {
            return await _unitOfWork.StoreRepository.GetAll()
                .Include(store => store.ShippingCosts)
                .ThenInclude(shippingCost => shippingCost.City)
                .FirstOrDefaultAsync(store => store.UserId == userId);
        }

        public async Task SetAsVerifiedStore(long userId)
        {
            var store = await GetStoreByUserId(userId);

            if (store == null)
            {
                throw new ServiceException("No store is found for this user");
            }

            store.Verified = true;

            _unitOfWork.StoreRepository.Update(store);
            await _unitOfWork.SaveChangesAsync();

            //Todo return a mail to user about vertified the store
        }
    }
}
