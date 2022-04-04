using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    public class Subscription
    {
        [Key]
        [ForeignKey("User")]
        public int SubscriptionId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public User User { get; set; }
    }
}
