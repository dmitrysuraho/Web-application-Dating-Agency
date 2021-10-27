using System;
namespace WebApplication.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Uid { get; set; }
        public string Sex { get; set; }
        public string Name { get; set; }
        public DateTime Birthday { get; set; }
        public string Region { get; set; }
        public string Photo { get; set; }
        public string About { get; set; }
    }
}
