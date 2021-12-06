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

        public object[] GetBlacklists(int currentUserId)
        {
            return _context.Users.Where(prop => _context.Blacklists.FirstOrDefault(p => p.UserId == currentUserId && p.BlockedUser == prop.UserId) != null)
                .Select(prop => new { prop.UserId, prop.Name, prop.Photo }).ToArray();
        }

        public bool IsUserBlocked(int currentUserId, int userId)
        {
            Blacklist blacklist = _context.Blacklists.FirstOrDefault(prop => prop.UserId == currentUserId && prop.BlockedUser == userId);
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
            Dating dating = _context.Datings.FirstOrDefault(prop => prop.UserId == user.UserId && prop.Candidate == userId);
            if (dating != null)
            {
                dating.IsFavorite = false;
                dating.IsLike = false;
                dating.IsIgnore = true;
            }
            else
            {
                _context.Datings.Add(new Dating
                {
                    Candidate = userId,
                    IsIgnore = true,
                    IsLike = false,
                    IsFavorite = false,
                    User = user
                });
            }
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
