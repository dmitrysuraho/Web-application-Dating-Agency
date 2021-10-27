using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebApplication.Models;
using WebApplication.Models.Users;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly ILogger<UsersController> _logger;
        private readonly UsersRepository _usersRepository;

        public UsersController(ILogger<UsersController> logger, ApplicationContext context)
        {
            _logger = logger;
            _usersRepository = new UsersRepository(context);
        }

        [HttpPost]
        public IActionResult Post([FromBody] User user)
        {
            bool result = _usersRepository.CreateUser(user);
            if (result)
            {
                return Json(new { message = "Successfully adding" });
            }
            else
            {
                return Json(new { message = "User with such UID has already existed" });
            }
        }
    }
}
