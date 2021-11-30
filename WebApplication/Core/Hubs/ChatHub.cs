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
                await Clients.Users(_GetCurrentUserId(_context), id).SendAsync("ReceiveMessage", message);
            }
        }

        private string _GetCurrentUserId(ApplicationContext context)
        {
            string token = Context.GetHttpContext().Request.Query["access_token"];
            string uid = FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token).Result.Uid;
            return context.Users.FirstOrDefault(prop => prop.Uid == uid).UserId.ToString();
        }
    }
}
