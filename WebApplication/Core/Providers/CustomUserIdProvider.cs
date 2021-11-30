using System;
using System.Linq;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.SignalR;
using WebApplication.Models;

namespace WebApplication.Core.Providers
{
    public class CustomUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            using (ApplicationContext _context = new ApplicationContext())
            {
                string token = connection.GetHttpContext().Request.Query["access_token"];
                string uid = FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token).Result.Uid;
                return _context.Users.FirstOrDefault(prop => prop.Uid == uid).UserId.ToString();
            }
            
        }
    }
}
