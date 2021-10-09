using System;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace WebApplication.Utils
{
    public class AuthOptions
    {
        const string KEY = "verify_key";   // ключ для шифрации
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}
