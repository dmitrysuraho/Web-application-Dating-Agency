using System;
namespace WebApplication.Models
{
    public class Post
    {
        public int PostId { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
