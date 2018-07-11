using Dissidia.League.App.Nancy.DTO.Matches;
using Dissidia.League.App.Nancy.EndpointsConfiguration;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.Services.Interfaces;
using Nancy;
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
            _matcheService = injection.Services.MatchService;

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

            Post[EndpointConfigurationEnum.UPLOAD_MATCH] = p =>
            {
                var contentTypeRegex = new Regex("^multipart/form-data;\\s*boundary=(.*)$", RegexOptions.IgnoreCase);
                var boundary = contentTypeRegex.Match(Request.Headers.ContentType).Groups[1].Value;
                var multipart = new HttpMultipart(this.Request.Body, boundary);
                var bodyStream = multipart.GetBoundaries().First(b => b.Name == "image").Value;
                _matcheService.RegisterMatches(new List<Stream>() { bodyStream });
                return HttpStatusCode.OK;
            };

        }

    }
}
