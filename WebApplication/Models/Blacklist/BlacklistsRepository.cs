using System;
using System.Collections.Generic;
using System.Linq;

namespace WebApplication.Models
{
    public class BlacklistsRepository
    {
        private readonly ApplicationContext _context;

        public BlacklistsRepository(ApplicationContext context)
        {
            _context = context;
        }

        public List<object> GetBlacklists(int currentUserId)
        {
            var blacklists = _context.Blacklists
                .Where(prop => prop.UserId == currentUserId).ToList();
            List<object> blockedUsers = new List<object>();
            foreach(var blacklist in blacklists)
            {
                User blockedUser = _context.Users.Find(blacklist.BlockedUser);
                blockedUsers.Add(new
                {
                    id = blockedUser.UserId,
                    name = blockedUser.Name,
                    photo = blockedUser.Photo
                });
            }
            return blockedUsers;
        }

        public bool IsUserBlocked(int currentUserId, int userId)
        {
            Blacklist blacklist =_context.Blacklists.FirstOrDefault(prop => prop.UserId == currentUserId && prop.BlockedUser == userId);
            if (blacklist == null) return false;
            else return true;
        }

        public bool IsYouBlocked(int currentUserId, int userId)
        {
            Blacklist blacklist = _context.Blacklists.FirstOrDefault(prop => prop.UserId == userId && prop.BlockedUser == currentUserId);
            if (blacklist == null) return false;
            else return true;
        }

        public void AddToBlacklist(User user, int userId)
        {
            Blacklist blacklist = _context.Blacklists.FirstOrDefault(prop => prop.UserId == user.UserId && prop.BlockedUser == userId);
            if (blacklist != null) return;
            _context.Blacklists.Add(new Blacklist
            {
                BlockedUser = userId,
                User = user
            });
            _context.SaveChanges();
        }

        public void RemoveFromBlackList(User user, int userId)
        {
            Blacklist blacklist = _context.Blacklists.FirstOrDefault(prop => prop.UserId == user.UserId && prop.BlockedUser == userId);
            if (blacklist == null) return;
            _context.Blacklists.Remove(blacklist);
            _context.SaveChanges();
        }
    }
}
