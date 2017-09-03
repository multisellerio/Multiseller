using System;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;

namespace MultiSellerIo.Services.Cache
{
    public interface ICacheService
    {
        Task<T> GetFromCacheIfExists<T>(string key, Func<Task<T>> getDataAction, bool refreshCache = false);
    }

    public class CacheService : ICacheService
    {
        private readonly IDistributedCache _distributedCache;
        public CacheService(IDistributedCache distributedCache)
        {
            _distributedCache = distributedCache;
        }

        public async Task<T> GetFromCacheIfExists<T>(string key, Func<Task<T>> getDataAction, bool refreshCache = false)
        {
            if (refreshCache)
            {
                return await GetAndSet(key, getDataAction);
            }

            var cacheData = await _distributedCache.GetStringAsync(key);

            if (!string.IsNullOrEmpty(cacheData))
            {
                return JsonConvert.DeserializeObject<T>(cacheData);
            }

            return await GetAndSet(key, getDataAction);
        }

        private async Task<T> GetAndSet<T>(string key, Func<Task<T>> getDataAction)
        {
            var data = await getDataAction();

            await _distributedCache.SetStringAsync(key, JsonConvert.SerializeObject(data, new JsonSerializerSettings
            {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            }));

            return data;
        }
    }
}
