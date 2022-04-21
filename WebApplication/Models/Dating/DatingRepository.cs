using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Logging;

namespace WebApplication.Models
{
    public class DatingRepository
    {
        private readonly ApplicationContext _context;

        public DatingRepository(ApplicationContext context)
        {
            _context = context;
        }

        public User GetDatingUser(int currentId, string sex, int minAge, int maxAge)
        {
            return _context.Users
                .Where(
                    prop => prop.UserId != currentId &&
                    (sex != "All" ? prop.Sex == sex : prop.Sex == "Male" || prop.Sex == "Female") &&
                    prop.Birthday <= _GetDateFromMinAge(minAge) &&
                    prop.Birthday >= _GetDateFromMaxAge(maxAge) &&
                    _context.Blacklists.FirstOrDefault(p => (p.UserId == currentId && p.BlockedUser == prop.UserId) ||
                                                            (p.UserId == prop.UserId && p.BlockedUser == currentId)) == null &&
                    _context.Datings.FirstOrDefault(p => p.UserId == currentId && p.Candidate == prop.UserId) == null)
                .FirstOrDefault();
        }

        public void Dating(User user, Dating dating)
        {
            Dating datingUser = _context.Datings.Where(prop => prop.UserId == user.UserId && prop.Candidate == dating.Candidate).FirstOrDefault();
            if (datingUser != null)
            {
                datingUser.IsIgnore = dating.IsIgnore;
                datingUser.IsLike = dating.IsLike;
                datingUser.IsFavorite = dating.IsFavorite;
                _context.SaveChanges();
            }
            else
            {
                _context.Datings.Add(new Dating
                {
                    Candidate = dating.Candidate,
                    IsIgnore = dating.IsIgnore,
                    IsLike = dating.IsLike,
                    IsFavorite = dating.IsFavorite,
                    User = user
                });
                _context.SaveChanges();
            }
        }

        public object[] GetFavorites(int userId)
        {
            return _context.Users
                .Where(prop => _context.Datings.FirstOrDefault(p => p.UserId == userId && prop.UserId == p.Candidate && p.IsFavorite == true) != null)
                .Select(prop => new { prop.UserId, prop.Name, prop.Photo }).ToArray();
        }

        public bool DeleteFavorite(int currentId, int id)
        {
            Dating favorite = _context.Datings.FirstOrDefault(prop => prop.UserId == currentId && prop.Candidate == id && prop.IsFavorite == true);
            if (favorite != null)
            {
                favorite.IsFavorite = false;
                favorite.IsLike = false;
                favorite.IsIgnore = true;
                _context.SaveChanges();
                return true;
            }
            return false;
        }

        public bool IsFavorite(int currentId, int id)
        {
            Dating favorite = _context.Datings.FirstOrDefault(prop => prop.UserId == currentId && prop.Candidate == id && prop.IsFavorite == true);
            return favorite != null;
        }

        private DateTime _GetDateFromMinAge(int age)
        {
            return new DateTime(DateTime.Now.Year - age, 12, 31, 23, 59, 59);
        }

        private DateTime _GetDateFromMaxAge(int age)
        {
            return new DateTime(DateTime.Now.Year - age, 1, 1);
        }
    }
}
