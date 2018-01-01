namespace MultiSellerIo.Api.Models
{
    public class CityBindingModel
    {
        public long CityId{ get; set; }
        public string CityName { get; set; }
        public long StateId { get; set; }
        public string ZipPostalCode { get; set; }
    }

    public class StateBindingModel
    {
        public long Id { get; set; }
        public string StateName { get; set; }
        public long CountryId { get; set; }
    }

    public class CountryBindingModel
    {
        public long CountryId { get; set; }
        public string CountryName { get; set; }
    }
}
