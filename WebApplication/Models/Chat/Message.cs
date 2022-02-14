using System;
namespace WebApplication.Models
{
    public class Message
    {
        public int MessageId { get; set; }
        public string MessageText { get; set; }
        public string MessageImage { get; set; }
        public string CreatedAt { get; set; }

        public int ChatId { get; set; }
        public Chat Chat { get; set; }

        public int? UserId { get; set; }
        public User User { get; set; }
    }
}
