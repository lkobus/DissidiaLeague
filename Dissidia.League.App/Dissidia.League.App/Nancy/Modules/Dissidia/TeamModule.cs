using Dissidia.League.App.Nancy.DTO;
using Dissidia.League.App.Nancy.DTO.Dissidia;
using Dissidia.League.App.Nancy.EndpointsConfiguration;
using Dissidia.League.Domain.Exceptions.Dissidia;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.Services.Interfaces.Dissidia;
using Dissidia.League.Domain.Services.Interfaces.Gamification;
using Nancy;
using Nancy.Extensions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Dissidia.League.App.Nancy.Modules.Dissidia
{
    public class TeamModule : NancyModule
    {

        private ITeamService _teamService;        
        private ITeamPontuationService _teamPontuationService;

        public TeamModule(IBootstrapInjection injection)
        {
            _teamService = injection.Services.Team;
            _teamPontuationService = injection.Services.TeamPontuation;
            Get[EndpointConfigurationEnum.GET_TEAM] = p =>
            {
                var teamId = p.teamId;
                return Response.AsJson(new TeamDTO(_teamService.GetTeam(teamId)));
            };

            Post[EndpointConfigurationEnum.JOIN_TEAM] = p =>
            {
                var token = p.token;
                var userId = p.userId;
                var teamid = p.teamId;
                _teamService.JoinTeam(userId, token, teamid);
                return HttpStatusCode.OK;
            };

            

            Get[EndpointConfigurationEnum.GET_TEAM_USER] = p =>
            {
                var team = _teamService.GetTeamFromUser(p.userId);
                if(team == null)
                {
                    return HttpStatusCode.NotFound;
                }
                return Response.AsJson(new TeamDTO(team));               
            };

            Put[EndpointConfigurationEnum.GET_IMAGE_TEAM] = p =>
            {
                var contentTypeRegex = new Regex("^multipart/form-data;\\s*boundary=(.*)$", RegexOptions.IgnoreCase);
                var boundary = contentTypeRegex.Match(Request.Headers.ContentType).Groups[1].Value;
                var multipart = new HttpMultipart(this.Request.Body, boundary);
                var bodyStream = multipart.GetBoundaries().First(b => b.Name == "image").Value;
                var teamId = p.teamId;
                _teamService.SubmitTeamImage(teamId, bodyStream);
                return HttpStatusCode.OK;
            };

            Get[EndpointConfigurationEnum.GET_IMAGE_TEAM] = p =>
            {
                try
                {
                    Stream imagem = _teamService.GetImage(p.teamId);
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

            Post[EndpointConfigurationEnum.CREATE_TEAM] = p =>
            {
                try
                {
                    var founderId = p.founderId.Value;
                    var dto = JsonConvert.DeserializeObject<TeamDTO>(Request.Body.AsString());
                    _teamService.CreateTeam(founderId, dto.Id, dto.Alias);
                    dto.Members.Where(c => c.Contains("@")).ToList()
                        .ForEach(c =>_teamService.InvitePlayer(c, dto.Id));
                    return HttpStatusCode.OK;
                }
                catch (TeamAlreadyExistException ex)
                {
                    return Response.AsJson(new GenericErrorDTO(ex));
                }
                catch (Exception ex)
                {
                    return Response.AsJson(new GenericErrorDTO(ex));
                }
            };

            Put[EndpointConfigurationEnum.INVITE_PLAYER_TEAM] = p =>
            {
                if (p.email.ToString().Contains("@"))
                {                    
                    _teamService.InvitePlayer(p.email.ToString(), p.teamId.ToString());
                    return HttpStatusCode.Accepted;
                }
                else
                {
                    return HttpStatusCode.NotAcceptable;
                }                                
            };            

            Get[EndpointConfigurationEnum.GET_TEAM_PONTUATIONS] = p =>
            {
                string id = p.teamId.ToString();
                var result = _teamPontuationService.GetTeamPontuations(id).Select(c => new PlayerPontuationDTO(c)).ToList();
                return Response.AsJson(result);
            };

        }

        
    }
}
