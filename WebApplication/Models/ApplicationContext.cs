﻿using System;
using Microsoft.EntityFrameworkCore;

namespace WebApplication.Models
{
    public class ApplicationContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Gallery> Galleries { get; set; }
        public DbSet<Notification> Notifications { get; set; }
        public DbSet<Blacklist> Blacklists { get; set; }
        public DbSet<Dating> Datings { get; set; }

        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
