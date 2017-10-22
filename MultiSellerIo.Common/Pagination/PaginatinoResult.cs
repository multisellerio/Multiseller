using System.Collections.Generic;

namespace MultiSellerIo.Common.Pagination
{
    public class PaginationResult<T>
    {
        public PaginationResult(int count, int currentPage, int pageSize, List<T> result)
        {
            Count = count;
            CurrentPage = currentPage;
            PageSize = pageSize;
            Result = result;
        }

        public int Count { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int Pages => (int)decimal.Ceiling((decimal) Count / PageSize);
        public List<T> Result { get; set; }
    }
}
