using System;
namespace WebApplication.Models
{
    public class Dating
    {
        public int DatingId { get; set; }
        public int Candidate { get; set; }
        public bool IsIgnore { get; set; }
        public bool IsLike { get; set; }
        public bool IsFavorite { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
