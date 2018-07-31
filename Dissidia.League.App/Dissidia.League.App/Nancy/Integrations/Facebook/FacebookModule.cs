using Nancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.App.Nancy.Integrations.Facebook
{
    public class FacebookModule : NancyModule
    {
        public FacebookModule()
        {

            Get["webhooks"] = p =>
            {
                return HttpStatusCode.OK;
            };


            Post["webhooks"] = p =>
            {
                return HttpStatusCode.OK;
            };
        }
    }
}
