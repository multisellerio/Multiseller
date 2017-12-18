namespace MultiSellerIo.Dal.Entity
{
    public class State
    {
        public long Id { get; set; }
        public string StateName { get; set; }
        public long CountryId { get; set; }
        public virtual Country Country { get; set; }
    }
}
