using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using WebApplication.Models;

namespace WebApplication.Core.Hubs
{
    public class CallHub : Hub
    {
        public async Task Send(string peerId, string userId, User user)
        {
            await Clients.Users(userId).SendAsync("ReceiveCall", peerId, user);
        }
    }
}
