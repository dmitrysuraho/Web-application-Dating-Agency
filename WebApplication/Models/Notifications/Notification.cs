using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    public class Notification
    {
        [Key]
        [ForeignKey("User")]
        public int NotificationId { get; set; }
        public bool Communication { get; set; }
        public bool Email { get; set; }
        public bool Security { get; set; }

        public User User { get; set; }
    }
}
