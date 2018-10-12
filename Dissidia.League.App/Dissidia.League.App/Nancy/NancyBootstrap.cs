using Dissidia.League.App.Nancy.Services;
using Dissidia.League.Bootstrap.Configuration;
using Dissidia.League.Bootstrap.Injections;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Nancy;
using Nancy.Bootstrapper;
using Nancy.Conventions;
using Nancy.Responses;
using Nancy.TinyIoc;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.App.Nancy
{
    public class NancyBootstrap : DefaultNancyBootstrapper
    {
        internal static IBootstrapInjection Injection { get; private set; }

        protected override void ApplicationStartup(TinyIoCContainer container, IPipelines pipelines)
        {
            base.ApplicationStartup(container, pipelines);

            pipelines.BeforeRequest.AddItemToEndOfPipeline(ctx =>
            {
#if DEBUG

#else
                /*
                try
                {
                    if (!(ctx.Request.Url.ToString().Contains("/login.html") ||
                        ctx.Request.Url.ToString().Contains("dissidia/login") ||
                        ctx.Request.Url.ToString().Contains("/canAccess") ||
                        ctx.Request.Url.ToString().Contains("dissidia/user/register"))
                    )
                   {                        
                        var logged = Convert.ToBoolean(ctx.Request.Session["logged"]);
                        if (logged)
                        {
                            return null;
                        }
                    }
                }
                catch (Exception)
                {
                    return new RedirectResponse("http://localhost:8999/forbidden", RedirectResponse.RedirectType.Temporary);
                }*/
#endif

                return null;
            });



            var configurationGlobal = new GlobalConfiguration(
                new DatabaseConfiguration("Dissidia", "mongodb://dissidia.eastus.cloudapp.azure.com"),
                new OCRConfiguration(@"C:\temp\OCR\Dissidia", @"C:\Users\leonardo.kobus\Desktop\lobby\input"),
                "http://localhost", @"C:\temp\dissidia\tokenDir");
            var i  = new BoostrapInjection(configurationGlobal);
            i.Services.RegisterAuthentication(new AuthenticationService(i.Repositories.User));
            Injection = i;              
            
            container.Register<IBootstrapInjection, BoostrapInjection>(i);            
        }


        protected override void ConfigureConventions(NancyConventions nancyConventions)
        {
            base.ConfigureConventions(nancyConventions);
            var p = ConfigurationManager.AppSettings["INSTALLDIR"];
            Conventions.StaticContentsConventions.AddDirectory(string.Empty, p);
        }

        protected override void RequestStartup(TinyIoCContainer container, IPipelines pipelines, NancyContext context)
        {
            //CORS Enable
            pipelines.AfterRequest.AddItemToEndOfPipeline((ctx) =>
            {
                ctx.Response.WithHeader("Access-Control-Allow-Origin", "*")
                                .WithHeader("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE,OPTIONS")
                                .WithHeader("Access-Control-Allow-Headers", "Accept, Origin, Content-type");
            });
        }

    }
}
