using Dissidia.League.Domain.Entities.Gamification;
using Dissidia.League.Domain.Events.Matches;
using Dissidia.League.Domain.Repositories.Interfaces.Gamification;
using Dissidia.League.Domain.Services.Interfaces.Gamification;
using Dissidia.League.Domain.ValueObjects.Gamification.Pontuation;
using System;
using System.Linq;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Services.Gamification
{
    public class PlayerPontuationService : IPlayerPontuationService
    {

        private IPlayerResultsRepository _playerResultsRepository;

        public PlayerPontuationService(IPlayerResultsRepository playerResultsRepository)
        {
            _playerResultsRepository = playerResultsRepository;
        }

        public List<PlayerPontuation> GetPlayersPontuations()
        {
            var result = new List<PlayerPontuation>();
            _playerResultsRepository.GetAll()
                .GroupBy(p => p.Info.Name)
                .ToList()
                .ForEach(player =>
                {
                    var totalWins = player.Count(p => p.Winner == true);
                    var totalLosts = player.Count(p => p.Winner == false);
                    result.Add(new PlayerPontuation(player.Key, totalWins, totalLosts));
                });
            return result;
        }

        public void OnMatchResolved(object sender, OnMatchDoneArgs args)
        {
            args.Match.PlayersTeamLooser.ForEach(p => _playerResultsRepository.Upsert(PlayerResults.Factory.CreatLost(p).Instance));
            args.Match.PlayersTeamWinner.ForEach(p => _playerResultsRepository.Upsert(PlayerResults.Factory.CreateWin(p).Instance));
        }
    }
}
