using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using WebApplication.Models;

namespace WebApplication.Core.Hubs
{
    public class NoticeHub : Hub
    {
        public async Task Send(Notice notice, string id)
        {
            using (ApplicationContext _context = new ApplicationContext())
            {
                int userId = int.Parse(id);
                Notification notification = _context.Notifications.FirstOrDefault(prop => prop.NotificationId == userId);
                if (notification.Communication)
                {
                    notice.UserId = userId;
                    _context.Notices.Add(notice);
                    _context.SaveChanges();
                    await Clients.Users(id).SendAsync("ReceiveNotice", notice);
                }
            }
        }
    }
}
