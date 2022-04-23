namespace WebApplication.Models
{
    public class Comment
    {
        public int CommentId { get; set; }
        public string CommentText { get; set; }
        public int UserId { get; set; }

        public int PostId { get; set; }
        public Post Post { get; set; }
    }
}
