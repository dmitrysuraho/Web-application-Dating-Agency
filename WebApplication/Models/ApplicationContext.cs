using System;
using Microsoft.EntityFrameworkCore;

namespace WebApplication.Models
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Subscription> Subscriptions { get; set; }
        public DbSet<Gallery> Galleries { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Notice> Notices { get; set; }
        public DbSet<Blacklist> Blacklists { get; set; }
        public DbSet<Dating> Datings { get; set; }
        public DbSet<Chat> Chats { get; set; }
        public DbSet<Member> Members { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Status> Statuses { get; set; }
        public DbSet<Settings> Settings { get; set; }
        public DbSet<Calendar> Calendars { get; set; }
        public DbSet<Event> Events { get; set; }

        public ApplicationContext() {}

        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Server=tcp:dating-agency-server.database.windows.net,1433;Initial Catalog=dating-agency;Persist Security Info=False;User ID=dsuraho;Password=f,d2001l5;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
            }
        }
    }
}
