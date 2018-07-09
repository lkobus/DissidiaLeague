using Dissidia.League.App.Nancy.DTO;
using Dissidia.League.App.Nancy.EndpointsConfiguration;
using Dissidia.League.Domain.Exceptions.Authentication;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.Services.Interfaces.Authentication;
using Nancy;
using Nancy.Extensions;
using Newtonsoft.Json;
using System;
using System.Threading;

namespace Dissidia.League.App.Nancy.Modules
{
    public class AuthenticationModule : NancyModule
    {

        private IAuthenticationService _authService;

        public AuthenticationModule(IBootstrapInjection injection)
        {
            _authService = injection.Services.AuthenticationService;
            Post[EndpointConfigurationEnum.LOGIN] = p =>
            {
                var body = Request.Body.AsString();
                var auth = JsonConvert.DeserializeObject<AuthDTO>(body);
                if(_authService.AuthUser(auth.Username, auth.Password))
                {
                    Request.Cookies["logged"] = "true";
                }
                else
                {
                    return HttpStatusCode.Unauthorized;
                }
                return Response.AsJson(new { Status = "OK" }, HttpStatusCode.Accepted);
            };

            Post[EndpointConfigurationEnum.REGISTER_USER] = p =>
            {
                try
                {
                    var userRegister = JsonConvert.DeserializeObject<UserRegisterDTO>(Request.Body.AsString());
                    _authService.RegisterUser(userRegister.Username, userRegister.Password, userRegister.Email);
                    return HttpStatusCode.Created;
                }
                catch (UserAlreadyExistException ex)
                {
                    return "User already exist";
                }
                catch (Exception)
                {
                    return "whoooops.";
                }
                
                

            };

            Get["oi"] = p =>
            {
                return Thread.CurrentThread.ManagedThreadId;
                
            };
        }
    }
}
