using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApplication.Models;

namespace WebApplication
{
    [Route("api")]
    [ApiController]
    public class TestController : ControllerBase
    {
        private readonly ILogger<TestController> _logger;
        private readonly ApplicationContext _context;

        public TestController(ILogger<TestController> logger, ApplicationContext context)
        {
            _logger = logger;
            _context = context;

            _context.Users.Add(new User {
                Name = "Dmitry",
                Age = 20
            });

            _context.Users.Add(new User
            {
                Name = "Vitaly",
                Age = 21
            });

            _context.Users.Add(new User
            {
                Name = "Nikita",
                Age = 19
            });

            _context.SaveChanges();
        }

        [Route("test")]
        public IEnumerable<User> get()
        {
            _logger.LogInformation("Get Users");
            return _context.Users;
        }
    }
}
