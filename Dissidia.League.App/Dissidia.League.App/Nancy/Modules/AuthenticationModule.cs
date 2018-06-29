using Nancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.App.Nancy.Modules
{
    public class AuthenticationModule : NancyModule
    {
        public AuthenticationModule()
        {

            Get["oi"] = p =>
            {
                return "";
            };
        }
    }
}
