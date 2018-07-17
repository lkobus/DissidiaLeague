using Dissidia.League.App.Nancy.DTO.Matches;
using Dissidia.League.App.Nancy.EndpointsConfiguration;
using Dissidia.League.Domain.Enums.Dissidia;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.Services.Interfaces;
using Nancy;
using Nancy.Extensions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace Dissidia.League.App.Nancy.Modules.League
{
    public class MatchModule : NancyModule
    {
        private IMatchesService _matcheService;

        public MatchModule(IBootstrapInjection injection)
        {
            _matcheService = injection.Services.Match;

            Get[EndpointConfigurationEnum.GET_ALL_MATCHES] = p =>
            {
                var dtos = _matcheService.GetAll()
                .Select(m => new MatchDTO(m));
                return Response.AsJson(dtos);                
            };


            Get[EndpointConfigurationEnum.GET_IMAGE_MATCH] = p =>
            {
                try
                {
                    Stream imagem = _matcheService.GetImage(p.id);
                    if(imagem == null)
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

            Get[EndpointConfigurationEnum.GET_MATCH] = p =>
            {
                var match = _matcheService.GetMatch(p.id);
                return Response.AsJson(new MatchDTO(match));
            };

            Put[EndpointConfigurationEnum.CHANGE_MATCH] = p =>
            {
                var matchId = p.id;
                var userId = p.userId;
                var match = JsonConvert.DeserializeObject<MatchDTO>(Request.Body.AsString());
                _matcheService.UpdateMatch(match.PlayersTeamWinner, match.PlayersTeamLooser, userId, matchId);
                return HttpStatusCode.Accepted;
            };               

            Post[EndpointConfigurationEnum.UPLOAD_MATCH] = p =>
            {
                var contentTypeRegex = new Regex("^multipart/form-data;\\s*boundary=(.*)$", RegexOptions.IgnoreCase);
                var boundary = contentTypeRegex.Match(Request.Headers.ContentType).Groups[1].Value;
                var multipart = new HttpMultipart(this.Request.Body, boundary);
                var bodyStream = multipart.GetBoundaries().First(b => b.Name == "image").Value;
                var type = Convert.ToInt32(p.matchType.Value);
                _matcheService.RegisterMatches(new List<Stream>() { bodyStream }, (MatchTypeEnum)type);
                return HttpStatusCode.OK;                
            };

        }

    }
}
