using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApplication
{
    [Route("api/test")]
    [ApiController]
    public class TestController : ControllerBase
    {
        List<Model> list = new List<Model>
        {
            new Model
            {
                Name = "Dmitry",
                Phone = "183113"
            },
            new Model
            {
                Name = "Vadim",
                Phone = "13131155"
            },
            new Model
            {
                Name = "Vitaly",
                Phone = "87556"
            }
        };
        public IEnumerable<Model> Get()
        {
            return list;
        }
    }
}
