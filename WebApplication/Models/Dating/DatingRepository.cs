using System;
namespace WebApplication.Models
{
    public class DatingRepository
    {
        private readonly ApplicationContext _context;

        public DatingRepository(ApplicationContext context)
        {
            _context = context;
        }

        public User GetDatingUser()
        {
            
            return null;
        }
    }
}
