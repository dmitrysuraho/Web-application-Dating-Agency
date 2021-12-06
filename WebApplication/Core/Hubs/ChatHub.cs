using System;
using System.Linq;
using System.Threading.Tasks;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using WebApplication.Models;

namespace WebApplication.Core.Hubs
{
    public class ChatHub : Hub
    {
        public async Task Send(Message message, string id)
        {
            using (ApplicationContext _context = new ApplicationContext())
            {
                int currentId = _GetCurrentUserId(_context);
                _context.Messages.Add(message);
                _context.Statuses.Add(new Status
                {
                    IsRead = false,
                    Message = message,
                    UserId = int.Parse(id)
                });
                _context.SaveChanges();
                await Clients.Users(currentId.ToString(), id).SendAsync("ReceiveMessage", message);
            }
        }

        private int _GetCurrentUserId(ApplicationContext context)
        {
            string token = Context.GetHttpContext().Request.Query["access_token"];
            string uid = FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token).Result.Uid;
            return context.Users.FirstOrDefault(prop => prop.Uid == uid).UserId;
        }
    }
}
