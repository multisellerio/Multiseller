using System.Linq;
using System.Threading.Tasks;

namespace MultiSellerIo.Dal.Repository.Core
{
    public interface IRepository<T>
    {
        Task<T> Get<TKey>(TKey id);
        IQueryable<T> GetAll();
        Task Add(T entity);
        Task Remove<TKey>(TKey id);
        void Update(T entity);
    }
}
