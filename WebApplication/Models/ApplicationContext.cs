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
                optionsBuilder.UseSqlServer("Server=dating-agency.mssql.somee.com;packet size=4096;user id=dsuraho_SQLLogin_1;pwd=hfibisvmh2;data source=dating-agency.mssql.somee.com;persist security info=False;initial catalog=dating-agency");
            }
        }
    }
}
