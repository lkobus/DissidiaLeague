using Dissidia.League.App.Nancy.DTO;
using Dissidia.League.App.Nancy.EndpointsConfiguration;
using Dissidia.League.Domain.Exceptions.Authentication;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.Services.Interfaces.Authentication;
using Nancy;
using Nancy.Extensions;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;

namespace Dissidia.League.App.Nancy.Modules
{
    public class AuthenticationModule : NancyModule
    {

        private IAuthenticationService _authService;

        public AuthenticationModule(IBootstrapInjection injection)
        {
            _authService = injection.Services.Authentication;
            Post[EndpointConfigurationEnum.LOGIN] = p =>
            {
                var body = Request.Body.AsString();
                var auth = JsonConvert.DeserializeObject<AuthDTO>(body);
                string id;
                if(_authService.AuthUser(auth.Username, auth.Password))
                {
                    id = _authService.GetUserIdByUsername(auth.Username);
                    Request.Cookies["logged"] = "true";
                }
                else
                {
                    return HttpStatusCode.Unauthorized;
                }
                return Response.AsJson(id, HttpStatusCode.Accepted);
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


            Put[EndpointConfigurationEnum.GET_IMAGE_USER] = p =>
            {
                var contentTypeRegex = new Regex("^multipart/form-data;\\s*boundary=(.*)$", RegexOptions.IgnoreCase);
                var boundary = contentTypeRegex.Match(Request.Headers.ContentType).Groups[1].Value;
                var multipart = new HttpMultipart(this.Request.Body, boundary);
                var bodyStream = multipart.GetBoundaries().First(b => b.Name == "image").Value;
                var teamId = p.userId;
                _authService.SubmitUserImage(teamId, bodyStream);
                return HttpStatusCode.OK;
            };

            Get[EndpointConfigurationEnum.GET_IMAGE_USER_BY_NICK] = p =>
            {
                try
                {
                    Stream imagem = _authService.GetImageFromNick(p.nickname);
                    if (imagem == null)
                    {
                        throw new ArgumentException("Não existe");
                    }
                    return Response.FromStream(imagem, "image/jpg");
                }
                catch (ArgumentException)
                {
                    return HttpStatusCode.NotFound;
                }
                catch (Exception)
                {
                    return HttpStatusCode.InternalServerError;
                }
            };

            Get[EndpointConfigurationEnum.GET_IMAGE_USER] = p =>
            {
                try
                {
                    Stream imagem = _authService.GetImage(p.userId);
                    if (imagem == null)
                    {
                        throw new ArgumentException("Não existe");
                    }
                    return Response.FromStream(imagem, "image/jpg");
                }
                catch (ArgumentException)
                {
                    return HttpStatusCode.NotFound;
                }
                catch (Exception)
                {
                    return HttpStatusCode.InternalServerError;
                }
            };

            Get["oi"] = p =>
            {
                return Thread.CurrentThread.ManagedThreadId;
                
            };
        }
    }
}
