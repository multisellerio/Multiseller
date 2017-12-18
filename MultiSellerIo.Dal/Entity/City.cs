namespace MultiSellerIo.Dal.Entity
{
    public class City
    {
        public long CityId { get; set; }
        public string CityName { get; set; }
        public string ZipPostalCode { get; set; }
        public long StateId { get; set; }
        public virtual State State { get; set; }
    }
}
