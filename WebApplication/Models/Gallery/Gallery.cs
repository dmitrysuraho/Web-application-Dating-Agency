using System;
namespace WebApplication.Models
{
    public class Gallery
    {
        public int GalleryId { get; set; }
        public string Image { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
