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
        [Route("news")]
        [HttpGet]
        public IActionResult GetNews()
        {
            User currentUser = _GetCurrentUser();
            return Json(_postsRepository.GetNews(currentUser.UserId));
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpPost]
        public IActionResult PostPost([FromBody] Post post)
        {
            return Json(_postsRepository.CreatePost(post, _GetCurrentUser()));
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("{id:int}")]
        [HttpDelete]
        public IActionResult DeletePost(int id)
        {
            _postsRepository.DeletePost(id);
            return Json(new { message = "Post is deleted" });
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("{id}/like")]
        [HttpPost]
        public IActionResult PostLike(int id)
        {
            User currentUser = _GetCurrentUser();
            _postsRepository.Like(currentUser.UserId, id);
            return Json(new { message = "Post is liked" });
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("{id}/like")]
        [HttpDelete]
        public IActionResult DeleteLike(int id)
        {
            User currentUser = _GetCurrentUser();
            _postsRepository.Unlike(currentUser.UserId, id);
            return Json(new { message = "Post is unliked" });
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("comment")]
        [HttpPost]
        public IActionResult PostComment([FromBody] Comment comment)
        {
            User currentUser = _GetCurrentUser();
            Comment addedComment = _postsRepository.AddComment(comment);
            return Json(new
            {
                commentId = addedComment.CommentId,
                commentText = addedComment.CommentText,
                postId = addedComment.PostId,
                userId = addedComment.UserId,
                sender = currentUser
            });
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("comment/{id}")]
        [HttpDelete]
        public IActionResult DeleteComment(int id)
        {
            _postsRepository.DeleteComment(id);
            return Json(new { message = "Comment is deleted" });
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
