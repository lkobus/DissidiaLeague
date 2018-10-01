using Dissidia.League.App.Nancy.DTO.Matches;
using Dissidia.League.App.Nancy.EndpointsConfiguration;
using Dissidia.League.Domain.Enums.Dissidia;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.Repositories.Interfaces;
using Dissidia.League.Domain.Services.Interfaces;
using Nancy;
using Nancy.Extensions;
using Nancy.Json;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;

namespace Dissidia.League.App.Nancy.Modules.League
{
    public class MatchModule : NancyModule
    {
        private IMatchesService _matcheService;
        private IMatchRepository _matchRepository;

        private Stream GetImageBodyStream()
        {
            var contentTypeRegex = new Regex("^multipart/form-data;\\s*boundary=(.*)$", RegexOptions.IgnoreCase);
            var boundary = contentTypeRegex.Match(Request.Headers.ContentType).Groups[1].Value;
            var multipart = new HttpMultipart(Request.Body, boundary);
            var bodyStream = multipart.GetBoundaries().First(b => b.Name == "image").Value;
            return bodyStream;
        }

        public MatchModule(IBootstrapInjection injection)
        {
            JsonSettings.MaxJsonLength = int.MaxValue;
            _matcheService = injection.Services.Match;
            _matchRepository = injection.Repositories.Match;
            Get[EndpointConfigurationEnum.GET_ALL_MATCHES] = p =>
            {
                var dtos = _matcheService.GetAll()
                .Select(m => new MatchDTO(m));
                return Response.AsJson(dtos);                
            };

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

            Post[EndpointConfigurationEnum.UPLOAD_MATCH, true] = async (x,p) =>
            {
                var bodyStream = GetImageBodyStream();
                int type = Convert.ToInt32(x.matchType.Value);
                await _matcheService.RegisterMatchAsync(bodyStream, (MatchTypeEnum)type);
                return HttpStatusCode.OK;
            };

            Post[EndpointConfigurationEnum.UPLOAD_MATCH_DETAILS] = x =>
            {                
                var bodyStream = GetImageBodyStream();
                int type = Convert.ToInt32(x.matchType.Value);
                string dateStr = x.dateTime.ToString();
                DateTime date = DateTime.ParseExact(dateStr, "yyyy-MM-dd_HH-mm-ss", CultureInfo.InvariantCulture);
                var t = _matcheService.RegisterMatchAsync(bodyStream, (MatchTypeEnum)type, date);
                t.Wait();
            

                return HttpStatusCode.OK;
            };
                                       

            Get["Import"] = p =>
            {
                var toImport = JsonConvert.DeserializeObject<List<MatchDTO>>(
                    System.IO.File.ReadAllText(
                    @"C:\users\leonardo.kobus\desktop\matches.txt"));
                toImport.ForEach(m =>
                {
                    try
                    {
                        var file = GetImageFile(m.Date.AddHours(-3));
                        var result = Domain.Entities.Match.Factory.FromDTO(
                            m.Id, m.Date, m.PlayersTeamWinner, m.PlayersTeamLooser,
                            m.Status, m.Winners, m.Loosers, file, MatchTypeEnum.SOLO
                            );
                        _matchRepository.Upsert(result.Instance);
                    }
                    catch (Exception ex)
                    {
                        var ops = "";
                    }
                    
                });
                return "ok";
            };

        }

        private static string GetImageFile(DateTime matchDate)
        {
            foreach(var file in Directory.GetFiles($"C:\\temp\\OCR\\Dissidia\\{matchDate.Date.ToString("dd-MM-yyyy")}"))
            {
                var info = new FileInfo(file);
                if(info.CreationTime.Minute == matchDate.Minute &&
                    info.CreationTime.Hour == matchDate.Hour)
                {
                    return file;
                }
            }
            return "";
        }

    }
}
