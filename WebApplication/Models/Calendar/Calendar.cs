using System;

namespace WebApplication.Models
{
    public class Calendar
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Color { get; set; }
        public bool Visible { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
