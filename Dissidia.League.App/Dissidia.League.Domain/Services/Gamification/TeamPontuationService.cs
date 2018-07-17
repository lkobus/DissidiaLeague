using Dissidia.League.Domain.Entities.Dissidia;
using Dissidia.League.Domain.Entities.Gamification;
using Dissidia.League.Domain.Enums.Dissidia;
using Dissidia.League.Domain.Events.Matches;
using Dissidia.League.Domain.Repositories.Interfaces.Dissidia;
using Dissidia.League.Domain.Repositories.Interfaces.Gamification;
using Dissidia.League.Domain.Services.Interfaces.Gamification;
using Dissidia.League.Domain.ValueObjects.Gamification.Pontuation;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Dissidia.League.Domain.Services.Gamification
{
    public class TeamPontuationService : ITeamPontuationService
    {
        private ITeamPontuationRepository _teamPontuationRepository;
        private ITeamRepository _teamRepository;
        private IPlayerPontuationService _playerPontuation;

        public TeamPontuationService(ITeamPontuationRepository teamPontuationRepository, ITeamRepository teamRepository, 
            IPlayerPontuationService playerPontuation)
        {
            _teamPontuationRepository = teamPontuationRepository;
            _teamRepository = teamRepository;
            _playerPontuation = playerPontuation;
        }

        public List<PlayerPontuation> GetTeamPontuations(string teamId)
        {
            var team = _teamRepository.GetById(teamId);            
            var players = team.Members.Select(m => _playerPontuation.GetPlayerPontuation(m)).ToList();
            var totalWins = players.Sum(p => p.Wins);
            var totalLosts = players.Sum(p => p.Losts);
            players = players.OrderBy(p => p.Losts).ToList();            
            players.Add(new PlayerPontuation(team.Id, totalWins, totalLosts));
            players.Reverse();
            return players;
        }

        public void OnMatchResolved(object sender, OnMatchDoneArgs args)
        {
            if(args.Match.Type == MatchTypeEnum.TEAM)
            {
                var results = _teamPontuationRepository.GetTeamsPontuationsIdsFromMatchId(args.Match.Id);
                if (results.Count > 0)
                {
                    results.ForEach(r => _teamPontuationRepository.Delete(r));                    
                }

                var teamWinnersMembers = args.Match.PlayersTeamWinner.Select(p => p.Name).ToList();
                var teamLoosersMembers = args.Match.PlayersTeamLooser.Select(p => p.Name).ToList();

                var teamWinner = TeamPontuation.Factory.CreateTeamWon(teamWinnersMembers,
                    args.Match.PlayersTeamWinner.Sum(p => p.Points), args.Match.Id, args.Match.TeamA);
                
                var teamLooser = TeamPontuation.Factory.CreateTeamLooser(teamLoosersMembers,
                    args.Match.PlayersTeamWinner.Sum(p => p.Points), args.Match.Id, args.Match.TeamB);

                _teamPontuationRepository.Upsert(teamWinner.Instance);
                _teamPontuationRepository.Upsert(teamLooser.Instance);
            }            
        }

    }
}
