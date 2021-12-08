using System;
namespace WebApplication.Models
{
    public class Notice
    {
        public int NoticeId { get; set; }
        public int Sender { get; set; }
        public string Action { get; set; }
        public bool IsRead { get; set; }
        public string Time { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
