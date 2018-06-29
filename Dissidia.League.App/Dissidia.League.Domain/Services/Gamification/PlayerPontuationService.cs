using Dissidia.League.Domain.Entities.Gamification;
using Dissidia.League.Domain.Events.Matches;
using Dissidia.League.Domain.Repositories.Interfaces.Gamification;
using Dissidia.League.Domain.Services.Interfaces.Gamification;
using System;

namespace Dissidia.League.Domain.Services.Gamification
{
    public class PlayerPontuationService : IPlayerPontuationService
    {

        private IPlayerResultsRepository _playerResultsRepository;

        public PlayerPontuationService(IPlayerResultsRepository playerResultsRepository)
        {
            _playerResultsRepository = playerResultsRepository;
        }

        public void OnMatchResolved(object sender, OnMatchDoneArgs args)
        {
            args.Match.PlayersTeamLooser.ForEach(p => _playerResultsRepository.Upsert(PlayerResults.Factory.CreatLost(p).Instance));
            args.Match.PlayersTeamWinner.ForEach(p => _playerResultsRepository.Upsert(PlayerResults.Factory.CreateWin(p).Instance));
        }
    }
}
