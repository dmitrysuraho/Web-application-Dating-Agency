using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using WebApplication.Core.Filters;
using WebApplication.Core.Hubs;
using WebApplication.Models;

namespace WebApplication.Controllers
{
    [Route("api/[controller]")]
    public class ChatsController : Controller
    {
        private readonly UsersRepository _usersRepository;
        private readonly ChatsRepository _chatsRepository;

        public ChatsController(ApplicationContext context)
        {
            _usersRepository = new UsersRepository(context);
            _chatsRepository = new ChatsRepository(context);
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpGet]
        public IActionResult Get()
        {
            User currentUser = _GetCurrentUser();
            return Json(_chatsRepository.GetChats(currentUser.UserId));
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("{id:int}")]
        [HttpGet]
        public IActionResult Get(int id)
        {
            User currentUser = _GetCurrentUser();
            var chat = _chatsRepository.GetChat(currentUser.UserId, id);
            if (chat == null)
            {
                return NotFound(new { message = "Chat is not found" });
            }
            else
            {
                return Json(chat);
            }
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("{id:int}")]
        [HttpPut]
        public IActionResult Put(int id)
        {
            User currentUser = _GetCurrentUser();
            _chatsRepository.ReadMessages(currentUser.UserId, id);
            return Json(new { message = "Messages have been read" });
        }

        [TypeFilter(typeof(AuthFilter))]
        [HttpPost]
        public IActionResult Post([FromBody] int id)
        {
            User currentUser = _GetCurrentUser();
            Chat chat = _chatsRepository.CreateOrGetChat(currentUser.UserId, id);
            return Json(new { chatId = chat.ChatId });
        }

        [TypeFilter(typeof(AuthFilter))]
        [Route("{id:int}/attachments")]
        [HttpGet]
        public IActionResult GetAttachments(int id)
        {
            return Json(_chatsRepository.GetChatAttachments(id));
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
