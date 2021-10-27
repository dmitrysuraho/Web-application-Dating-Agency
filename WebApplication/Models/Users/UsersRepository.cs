using System;
using System.Linq;

namespace WebApplication.Models.Users
{
    public class UsersRepository
    {
        private readonly ApplicationContext _context;

        public UsersRepository(ApplicationContext context)
        {
            _context = context;
        }

        public User FindUserByUid(string uid)
        {
            return _context.Users.FirstOrDefault(prop => prop.Uid == uid);
        }

        public bool CreateUser(User user)
        {
            User candidate = FindUserByUid(user.Uid);
            if (candidate != null) return false;
            _context.Users.Add(user);
            _context.SaveChanges();
            return true;
        }
    }
}
