using Dissidia.League.App.Nancy.EndpointsConfiguration;
using Dissidia.League.Domain.DataTransferObject.Matches;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.Services.Interfaces;
using Nancy;
using System.Linq;

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

        }

    }
}
