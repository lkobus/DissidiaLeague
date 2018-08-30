using Dissidia.League.Domain.Entities.Gamification;
using Dissidia.League.Domain.Events.Matches;
using Dissidia.League.Domain.Repositories.Interfaces.Gamification;
using Dissidia.League.Domain.Services.Interfaces.Gamification;
using Dissidia.League.Domain.ValueObjects.Gamification.Pontuation;
using System;
using System.Linq;
using System.Collections.Generic;
using Dissidia.League.Domain.Repositories.Interfaces.Authentication;
using Dissidia.League.Domain.Enums;
using Dissidia.League.Domain.Enums.Gamification;
using Dissidia.League.Domain.Repositories.Interfaces;
using Dissidia.League.Domain.Enums.Dissidia;
using System.Globalization;
using Dissidia.League.Domain.ValueObjects.Matche;
using Dissidia.League.Domain.ValueObjects.Match;
using Dissidia.League.Domain.Tools.Helpers.Graph;
using MoreLinq;
using Dissidia.League.Domain.Enums.Matches;

namespace Dissidia.League.Domain.Services.Gamification
{
    public class PlayerPontuationService : IPlayerPontuationService
    {        
        private IMatchRepository _matchRepository;
        private IPlayerResultsRepository _playerResultsRepository;
        private IUserRepository _userRepository;

        public PlayerPontuationService(IPlayerResultsRepository playerResultsRepository, IUserRepository userRepository, 
            IMatchRepository matchRepository)
        {
            _playerResultsRepository = playerResultsRepository;
            _userRepository = userRepository;
            _matchRepository = matchRepository;
        }

        public void DeleteByMatchId(string matchId)
        {
            _playerResultsRepository.DeleteByMatchId(matchId);            
        }

        public ScorePontuation GetPlayerPontuation(string userId)
        {
            var user = _userRepository.GetById(userId);
            return CalculateUserScores(_playerResultsRepository.GetByUser(user)).FirstOrDefault();                        
        }

        public List<ScorePontuation> GetPlayersPontuations()
        {
            return CalculateScores(_playerResultsRepository.GetAll().GroupBy(p=> p.Info.Name), ScoreTypeEnum.PLAYER);
        }        

        


        private List<ScorePontuation> CalculateUserScores(List<PlayerResults> playersResults)
        {            
            return CalculateScores(playersResults.GroupBy(p => p.Info.Name), ScoreTypeEnum.PLAYER);
        }

        private ScorePontuation CalculateUserScoresBy(List<PlayerResults> playersResults, string value, ScoreTypeEnum type)
        {
            if (ScoreTypeEnum.CHAR == type)
            {
                return CalculateCharScores(playersResults).FirstOrDefault(p => p.Name == value);
            }
            else if (ScoreTypeEnum.PLAYER == type)
            {
                return CalculateScores(playersResults.GroupBy(p => p.Info.Name), type)
                .FirstOrDefault(p => p.Name == value);
            }
            else
            {
                return CalculateRoleScores(playersResults).FirstOrDefault(p => p.Name == value);
            }                    
        }

        private List<ScorePontuation> CalculateCharScores(List<PlayerResults> playersResults)
        {
            return CalculateScores(playersResults.GroupBy(p => ((CharEnum)p.Info.Character).Valor), ScoreTypeEnum.CHAR);
        }

        private List<ScorePontuation> CalculateRoleScores(List<PlayerResults> playersResults)
        {
            return CalculateScores(playersResults.GroupBy(p => ((CharEnum)p.Info.Character).Role), ScoreTypeEnum.ROLE);
        }

        private List<ScorePontuation> CalculateScores(IEnumerable<IGrouping<string,PlayerResults>> results, ScoreTypeEnum scoreType)
        {            
            return results.ToList().Where(p => !string.IsNullOrEmpty(p.Key) ||
                !string.IsNullOrWhiteSpace(p.Key)).Select(player =>
            {                
                var totalWins = player.Count(p => p.Winner == true);
                var totalLosts = player.Count(p => p.Winner == false);
                return new ScorePontuation(player.Key, totalWins, totalLosts, scoreType);               
                 
            }).ToList();            
        }

        public void OnMatchResolved(object sender, OnMatchDoneArgs args)
        {
            if(args.Match.Status == MatchStatusEnum.CONCLUDED)
            {
                if (!args.IsOCRUpdate)
                {
                    _playerResultsRepository.DeleteByMatchId(args.Match.Id);
                }
                args.Match.PlayersTeamLooser.ForEach(p => _playerResultsRepository.Upsert(PlayerResults.Factory.CreatLost(p, args.Match.Id).Instance));
                args.Match.PlayersTeamWinner.ForEach(p => _playerResultsRepository.Upsert(PlayerResults.Factory.CreateWin(p, args.Match.Id).Instance));
            }            
        }

        public List<ScorePontuation> GetPlayerInfo(string id)
        {
            var user = _userRepository.GetById(id);
            var results = _playerResultsRepository.GetByUser(user);
            return CalculatePlayerInfo(results);
        }

        public List<ScorePontuation> GetPlayerInfo(string userId, DateTime from, DateTime until)
        {            
            var user = _userRepository.GetById(userId);
            var matchs = _matchRepository.GetMatchBetween(from, until);
            var results = _playerResultsRepository.GetByUser(user, matchs);
            return CalculatePlayerInfo(results);
        }

        private List<ScorePontuation> CalculatePlayerInfo(List<PlayerResults> results)
        {
            var result = new List<ScorePontuation>();
            result = CalculateUserScores(results).Concat(result).ToList();
            result = CalculateCharScores(results).Concat(result).ToList();
            result = CalculateRoleScores(results).Concat(result).ToList();
            return result;
        }

        public LineGraph GetLineGraph(string id, int period, int type)
        {
            var user = _userRepository.GetById(id);
            var results = _playerResultsRepository.GetByUser(user);                        

            var matches = results.Select(r => r.MatchId);
            var matchesPeriod = _matchRepository.GetMatchesFrom(CalculateLineGraphHelper.GetDateFromPeriod(period));
            var avaliableMatches = matchesPeriod.Where(m => matches.Contains(m.Id))
                .ToList();;

            var matchResult = avaliableMatches.Join(results,
                m => m.Id,
                s => s.MatchId, 
                (match, score) => new MatchScoreGroup(match, score))
                .ToList();

            var resultGroup = CalculateLineGraphHelper.GroupByPeriod(period, matchResult);
            var data = new List<LineGraphData>();

            if (IsChar(type))
            {
                data = CalculateLineGraphHelper.CalculateLineGraphData(resultGroup, ((CharEnum)type).Valor, ScoreTypeEnum.CHAR, CalculateUserScoresBy);                
            }
            else if (IsRole(type))
            {
                data = CalculateLineGraphHelper.CalculateLineGraphData(resultGroup, ((RolesEnum)type).Valor, ScoreTypeEnum.ROLE, CalculateUserScoresBy);                
            }
            else
            {
                data = CalculateLineGraphHelper.CalculateLineGraphData(resultGroup, user.Credentials.Username, ScoreTypeEnum.PLAYER, CalculateUserScoresBy);                
            }
            return new LineGraph(data);
        }                

        

        private string GetValueByType(int type)
        {
            if(type > 0)
            {
                return CharEnum.ToList().FirstOrDefault(p => p.Codigo == type).Valor;
            }
            else
            {
                if (type < -1)
                {
                    switch (type)
                    {
                        case -2:
                            return RolesEnum.VANGUARD;
                        case -3:
                            return RolesEnum.ASSASSIN;
                        case -4:
                            return RolesEnum.MASKSMEN;
                        case -5:
                            return RolesEnum.SPECIALIST;
                    }
                }
                else
                {
                    return "PLAYER"; ;
                }
                return CharEnum.ToList().FirstOrDefault(p => p.Codigo == type).Valor;
            }
        }
    

        private bool IsPlayer(int type)
        {
            return type == -1;
        }

        private bool IsRole(int type)
        {
            return type < -1 && type > -6;
        }

        private bool IsChar(int type)
        {
            return type >= 0;
        }

        public List<ScorePontuation> GetSoloBestDuosPontuation()
        {
            var result = new List<ScorePontuation>();
            var matches = _matchRepository.GetAllConcluded();

         
            var last = 1;
            var winners = new List<IGrouping<string, Entities.Match>>();
            var loosers = new List<IGrouping<string, Entities.Match>>();
            for (var i = 0; i < 2; i++)
            {
                
                winners = matches.GroupBy(p =>
                    string.Join(",", p.PlayersTeamWinner.Select(c => c.Name).OrderBy(c => c).ToArray()).Split(',')[i] + ","+
                    string.Join(",", p.PlayersTeamWinner.Select(c => c.Name).OrderBy(c => c).ToArray()).Split(',')[last]
                ).Concat(winners).ToList();

                loosers = matches.GroupBy(p =>
                    string.Join(",", p.PlayersTeamLooser.Select(c => c.Name).OrderBy(c => c).ToArray()).Split(',')[i] + "," +
                    string.Join(",", p.PlayersTeamLooser.Select(c => c.Name).OrderBy(c => c).ToArray()).Split(',')[last]
                ).Concat(loosers).ToList();


                if (last == 1)
                {                    
                    last += 1;
                    i--;
                }
            }

            return CalculateSoloScorePontuation(winners, loosers);
        }

        public List<ScorePontuation> GetSoloTeamsPontuations()
        {
            var result = new List<ScorePontuation>();
            var matches = _matchRepository.GetAllConcluded();
            
            var winners = matches.GroupBy(p =>
                string.Join(",", p.PlayersTeamWinner.Select(c => c.Name).OrderBy(c => c).ToArray()                
                )
            );
            var loosers = matches.GroupBy(p =>
                string.Join(",", p.PlayersTeamLooser.Select(c => c.Name).OrderBy(c => c).ToArray())
            );            
            return CalculateSoloScorePontuation(winners, loosers);
        }

        private List<ScorePontuation> CalculateSoloScorePontuation(IEnumerable<IGrouping<string, Entities.Match>> winners,
            IEnumerable<IGrouping<string, Entities.Match>> loosers)
        {
            var result = new List<ScorePontuation>();
            var allTeams = winners.Select(p => p.Key)
                .Concat(loosers.Select(p => p.Key))
                .DistinctBy(p => p);

            allTeams.ForEach(team =>
            {
                if(!IsEmptyTeam(team))
                {
                    var w = GetCountByTeam(team, winners);
                    var l = GetCountByTeam(team, loosers);
                    result.Add(new ScorePontuation(team, w, l, ScoreTypeEnum.TEAM));
                }                
            });
            return result;
        }

        private bool IsEmptyTeam(string team)
        {
            var p = team.Split(',');
            foreach(var c in p)
            {
                if(string.IsNullOrEmpty(c) || string.IsNullOrWhiteSpace(c))
                {
                    return true;
                }
            }
            return false;
        }
        
        private int GetCountByTeam(string team, IEnumerable<IGrouping<string, Entities.Match>> matches)
        {
            var result = 0;
            matches.Where(p => p.Key == team)
                .ForEach(m =>
                {
                    result += m.Count();
                });            
            return result;
        }

    }
}
