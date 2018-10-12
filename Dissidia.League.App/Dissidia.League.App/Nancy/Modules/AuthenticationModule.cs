using Dissidia.League.App.Nancy.DTO;
using Dissidia.League.App.Nancy.EndpointsConfiguration;
using Dissidia.League.App.Nancy.Services;
using Dissidia.League.Domain.Entities;
using Dissidia.League.Domain.Exceptions.Authentication;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.Services.Interfaces.Authentication;
using Nancy;
using Nancy.Extensions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Dissidia.League.App.Nancy.Modules
{
    public class AuthenticationModule : NancyModule
    {

        private IAuthenticationService _authService;

        public AuthenticationModule(IBootstrapInjection injection)
        {
            _authService = injection.Services.Authentication;

            #region utilities
            Get["JustdoIt"] = p =>
            {
                HelperService.RepairNames(injection);
                return "";
            };

            
            Get["Repair"] = p =>
            {

                var ms = injection.Repositories.Match.GetAll();
                var toRelace = new List<Match>();
                var toEnter = true;
                foreach(var m in ms)
                {
                    if(m.Id == "5bb4556acab1201a6c6c954a")
                    {
                        toEnter = false;
                    }
                    if (!toEnter)
                    {
                        toRelace.Add(m);
                    }
                    if(m.Id == "5bb48214cab1201a6c6c97c3")
                    {
                        break;
                    }
                }
                var i = 0;
                Parallel.ForEach(toRelace, m =>
                {
                    i++;
                    injection.Services.Match.UpdateMatch(m.PlayersTeamWinner, m.PlayersTeamLooser, "Barreto",
                        m.Id);
                });
                
                    var parou = "";
                return "ok";
            };

            Get["MatchDate"] = p =>
            {
                var options = new ParallelOptions();
                options.MaxDegreeOfParallelism = 20;
                var regex = new System.Text.RegularExpressions.Regex(@"\d{4}:\d{2}:\d{2} \d{2}:\d{2}:\d{2}");                
                Parallel.ForEach(
                System.IO.Directory.GetFiles("C:\\temp\\match")
                .ToList(), options, f =>
                {
                    try
                    {
                        var date = DateTime.ParseExact(regex.Match(System.IO.File.ReadAllText(f)).Value, "yyyy:MM:dd HH:mm:ss", CultureInfo.InvariantCulture);
                        var id = new FileInfo(f).Name.Split('.')[0];
                        injection.Repositories.Match.Upsert(
                        Match.Factory.From(injection.Repositories.Match.GetById(id))
                            .WithDate(date)
                            .Instance);
                    }
                    catch (Exception)
                    {
                        var cagou = "";
                    }
                    

                });



                return "ok";
            };

            #endregion
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
                var contentTypeRegex = new System.Text.RegularExpressions.Regex("^multipart/form-data;\\s*boundary=(.*)$", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
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

            Get[EndpointConfigurationEnum.GET_NICKS_BY_ID] = p =>
            {
                string result = _authService.GetNicknameById(p.userId.ToString());
                return Response.AsJson(result);                
            };
        }
    }
}
