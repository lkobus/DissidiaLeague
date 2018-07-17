using Dissidia.League.App.Nancy.DTO;
using Dissidia.League.App.Nancy.EndpointsConfiguration;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.Services.Interfaces.Gamification;
using Nancy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.App.Nancy.Modules.League.Gamificatio
{
    public class PontuationModule : NancyModule
    {

        private IPlayerPontuationService _playerPontuation;

        public PontuationModule(IBootstrapInjection injection)
        {
            _playerPontuation = injection.Services.PlayerPontuation;
            Get[EndpointConfigurationEnum.GET_PLAYER_PONTUATION] = p =>
            {
                var result = _playerPontuation.GetPlayersPontuations().Select(c => new PlayerPontuationDTO(c))
                .ToList();
                return Response.AsJson(result);
            };

            Get[EndpointConfigurationEnum.GET_PLAYER_PONTUATION_BY_ID] = p =>
            {
                var id = p.userId;
                var result = new PlayerPontuationDTO(_playerPontuation.GetPlayerPontuation(id));                
                return Response.AsJson(result);
            };

        }
    }
}
