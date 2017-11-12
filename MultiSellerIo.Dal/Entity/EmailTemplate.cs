namespace MultiSellerIo.Dal.Entity
{ 
    public class EmailTemplate
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public string From { get; set; }
        public string Subject { get; set; }
        public string Content { get; set; }
    }
}
