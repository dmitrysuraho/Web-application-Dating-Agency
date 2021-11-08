using System;
using System.Collections.Generic;
using System.Linq;

namespace WebApplication.Models
{
    public class NotificationsRepository
    {
        private readonly ApplicationContext _context;

        public NotificationsRepository(ApplicationContext context)
        {
            _context = context;
        }

        public Notification GetNotifications(string uid)
        {
            return _context.Notifications.FirstOrDefault(prop => prop.User.Uid == uid);
        }

        public Notification UpdateNotifications(Notification notifications, string uid)
        {
            Notification updatedNotifications = _context.Notifications.FirstOrDefault(prop => prop.User.Uid == uid);
            updatedNotifications.Communication = notifications.Communication;
            updatedNotifications.Email = notifications.Email;
            updatedNotifications.Security = notifications.Security;
            _context.SaveChanges();
            return updatedNotifications;
        }
    }
}
