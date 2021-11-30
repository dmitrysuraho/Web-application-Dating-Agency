using System;
namespace WebApplication.Models
{
    public class Chat
    {
        public int ChatId { get; set; }

        public int? UserId { get; set; }
        public User User { get; set; }
    }
}
