using System;

namespace WebApplication.Models
{
    public class Event
    {
        public int Id { get; set; }
        public int CalendarId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Start { get; set; }
        public string End { get; set; }
        public bool AllDay { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
