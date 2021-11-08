using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebApplication.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string Uid { get; set; }
        public string Sex { get; set; }
        public string Name { get; set; }
        public DateTime Birthday { get; set; }
        public string Region { get; set; }
        public string Photo { get; set; }
        public string About { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public Notification Notifications { get; set; }
        public List<Blacklist> Blacklists { get; set; }
    }
}
