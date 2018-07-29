using Dissidia.League.App.Nancy.DTO;
using Dissidia.League.App.Nancy.EndpointsConfiguration;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.Services.Interfaces.Gamification;
using Dissidia.League.Domain.ValueObjects.Gamification.Pontuation;
using Nancy;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading;
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
                List<PlayerPontuationDTO> result = new List<PlayerPontuationDTO>();
                Thread.Sleep(5000);
                List<ScorePontuation> oi = _playerPontuation.GetPlayerInfo(id);                               
                return Response.AsJson(oi.Select(c => new PlayerPontuationDTO(c)).ToList());
            };

            Get[EndpointConfigurationEnum.GET_PLAYER_PONTUATION_BY_ID_AND_DATE] = p =>
            {
                var id = p.userId;
                DateTime from = DateTime.ParseExact(p.from, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                DateTime until = DateTime.ParseExact(p.until, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                List<PlayerPontuationDTO> result = new List<PlayerPontuationDTO>();                
                List<ScorePontuation> oi = _playerPontuation.GetPlayerInfo(id, from, until);
                return Response.AsJson(oi.Select(c => new PlayerPontuationDTO(c)).ToList());
            };

            Get[EndpointConfigurationEnum.GET_PLAYER_LINE_GRAPH] = p =>
            {
                var id = p.userId;
                int type = 0;
                int.TryParse(p.typ.Value, out type);

                int period = 0;
                int.TryParse(p.period.Value, out period);
                LineGraph result =_playerPontuation.GetLineGraph(id, period, type);
                return Response.AsJson(result);
            };



        }
    }
}
