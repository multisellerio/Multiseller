using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace MultiSellerIo.Dal.Repository.Core
{
    public interface IRepository<T> where T: class 
    {
        Task<T> Get<TKey>(TKey id);
        IQueryable<T> GetAllAsQueryable();
        Task Add(T entity);
        Task Remove<TKey>(TKey id);
        void Update(T entity);
        void SetCurrentValues(T entity, object valueObject);
    }
}
