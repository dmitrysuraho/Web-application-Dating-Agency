using System;
using System.Collections.Generic;

namespace WebApplication.Models
{
    public class Post
    {
        public int PostId { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }

        public List<Like> Likes { get; set; }
        public List<Comment> Comments { get; set; }
    }
}
