using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    public class Blacklist
    {
        public int BlacklistId { get; set; }
        public int BlockedUser { get; set; }

        public int UserId { get; set; }
        public User User { get; set; }
    }
}
