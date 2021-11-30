using System;
namespace WebApplication.Models
{
    public class Member
    {
        public int MemberId { get; set; }

        public int ChatId { get; set; }
        public Chat Chat { get; set; }

        public int? UserId { get; set; }
        public User User { get; set; }
    }
}
