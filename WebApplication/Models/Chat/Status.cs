using System;
namespace WebApplication.Models
{
    public class Status
    {
        public int StatusId { get; set; }
        public bool IsRead { get; set; }

        public int MessageId { get; set; }
        public Message Message { get; set; }

        public int? UserId { get; set; }
        public User User { get; set; }
    }
}
