namespace WebApplication.Models
{
    public class Like
    {
        public int LikeId { get; set; }
        public int UserId { get; set; }

        public int PostId { get; set; }
        public Post Post { get; set; }
    }
}
