using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    public class Settings
    {
        [Key]
        [ForeignKey("User")]
        public int SettingsId { get; set; }
        public string DateFormat { get; set; }
        public string TimeFormat { get; set; }
        public int StartWeekOn { get; set; }

        public User User { get; set; }
    }
}
