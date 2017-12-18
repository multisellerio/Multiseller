using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MultiSellerIo.Core.Exception;
using MultiSellerIo.Dal.Repository;

namespace MultiSellerIo.Services.Store
{

    public interface IStoreService
    {
        Task<Dal.Entity.Store> AddOrUpdateStore(Dal.Entity.Store store);
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

                _unitOfWork.StoreRepository.SetCurrentValues(currentStore, store);

                await _unitOfWork.SaveChangesAsync();

                return store;
            }

            await _unitOfWork.StoreRepository.Add(store);
            await _unitOfWork.SaveChangesAsync();

            return store;
        }

        public async Task<Dal.Entity.Store> GetStoreByUserId(long userId)
        {
            return await _unitOfWork.StoreRepository.GetAll()
                .Include(store => store.ShippingCosts)
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
