using System;
using System.Threading.Tasks;
using FirebaseAdmin.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using WebApplication.Models;

namespace WebApplication.Core.Filters
{
    public class AuthFilter : Attribute, IAuthorizationFilter
    {
        private readonly UsersRepository _usersRepository;

        public AuthFilter(ApplicationContext context)
        {
            _usersRepository = new UsersRepository(context);
        }

        public void OnAuthorization(AuthorizationFilterContext context)
        {
            HttpRequest request = context.HttpContext.Request;
            string authHeader = request.Headers["Authorization"];
            if (string.IsNullOrEmpty(authHeader))
            {
                _getError(context, 401, "Unauthorize");
            }
            else
            {
                try
                {
                    string token = authHeader.Split(' ')[1];
                    string uid = FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(token).Result.Uid;
                    if (_usersRepository.FindUserByUid(uid) == null)
                    {
                        _getError(context, 403, "Forbidden");
                    }
                }
                catch(Exception error)
                {
                    _getError(context, 401, error.Message);
                }
            }
        }

        private void _getError(AuthorizationFilterContext context, int statusCode, string message)
        {
            context.HttpContext.Response.StatusCode = statusCode;
            context.Result = new JsonResult(new { message = message });
        }
    }
}
