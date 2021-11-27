using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
using WebApplication.Core.Filters;
using WebApplication.Models;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class PostsController : Controller
    {
        private readonly UsersRepository _usersRepository;
        private readonly PostsRepository _postsRepository;

        public PostsController(ApplicationContext context)
        {
            _usersRepository = new UsersRepository(context);
            _postsRepository = new PostsRepository(context);
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpPost]
        public IActionResult Post([FromBody] Post post)
        {
            return Json(_postsRepository.CreatePost(post, _GetCurrentUser()));
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("{id:int}")]
        [HttpDelete]
        public IActionResult Dlete(int id)
        {
            _postsRepository.DeletePost(id);
            return Json(new { message = "Post is deleted" });
        }

        private User _GetCurrentUser()
        {
            string authHeader = HttpContext.Request.Headers["Authorization"];
            string token = authHeader.Split(' ')[1];
            string uid = FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token).Result.Uid;
            return _usersRepository.FindUserByUid(uid);
        }
    }
}
