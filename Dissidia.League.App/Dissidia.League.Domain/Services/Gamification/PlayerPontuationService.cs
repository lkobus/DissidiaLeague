using Dissidia.League.Domain.Entities.Gamification;
using Dissidia.League.Domain.Events.Matches;
using Dissidia.League.Domain.Repositories.Interfaces.Gamification;
using Dissidia.League.Domain.Services.Interfaces.Gamification;
using Dissidia.League.Domain.ValueObjects.Gamification.Pontuation;
using System;
using System.Linq;
using System.Collections.Generic;
using Dissidia.League.Domain.Repositories.Interfaces.Authentication;

namespace Dissidia.League.Domain.Services.Gamification
{
    public class PlayerPontuationService : IPlayerPontuationService
    {

        private IPlayerResultsRepository _playerResultsRepository;
        private IUserRepository _userRepository;

        public PlayerPontuationService(IPlayerResultsRepository playerResultsRepository, IUserRepository userRepository)
        {
            _playerResultsRepository = playerResultsRepository;
            _userRepository = userRepository;
        }

        public void DeleteByMatchId(string matchId)
        {
            _playerResultsRepository.DeleteByMatchId(matchId);            
        }

        public PlayerPontuation GetPlayerPontuation(string userId)
        {
            var nickName = _userRepository.GetById(userId).Credentials.Username;
            return CalculateUserScores(_playerResultsRepository.GetByUser(nickName)).FirstOrDefault();                        
        }

        public List<PlayerPontuation> GetPlayersPontuations()
        {
            return CalculateUserScores(_playerResultsRepository.GetAll());
        }        

        private List<PlayerPontuation> CalculateUserScores(List<PlayerResults> playersResults)
        {
            var result = new List<PlayerPontuation>();
            playersResults.GroupBy(p => p.Info.Name)
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
            if (!args.IsOCRUpdate)
            {
                _playerResultsRepository.DeleteByMatchId(args.Match.Id);                
            }            
            args.Match.PlayersTeamLooser.ForEach(p => _playerResultsRepository.Upsert(PlayerResults.Factory.CreatLost(p, args.Match.Id).Instance));
            args.Match.PlayersTeamWinner.ForEach(p => _playerResultsRepository.Upsert(PlayerResults.Factory.CreateWin(p, args.Match.Id).Instance));

        }
    }
}
