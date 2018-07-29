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

namespace Dissidia.League.Domain.Services.Gamification
{
    public class PlayerPontuationService : IPlayerPontuationService
    {

        private DateTime _start = new DateTime(2018, 02, 1);
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
            return results.ToList().Select(player =>
            {
                 var totalWins = player.Count(p => p.Winner == true);
                 var totalLosts = player.Count(p => p.Winner == false);
                
                 return new ScorePontuation(player.Key, totalWins, totalLosts, scoreType);
            }).ToList();            
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
            var matchesPeriod = _matchRepository.GetMatchesFrom(GetDateFromPeriod(period));
            var avaliableMatches = matchesPeriod.Where(m => matches.Contains(m.Id))
                .ToList();;

            var matchResult = avaliableMatches.Join(results,
                m => m.Id,
                s => s.MatchId,
                (match, score) => new { Match = match, Score = score }
                );

            var matchGroup = matchResult.GroupBy(p => p.Match.Date.ToString("dd/MM/yyyy")).ToList();

            var wins = new List<int>();
            var losts = new List<int>();
            var label = new List<string>();
            if (IsChar(type))
            {
                results.RemoveAll(p => p.Info.Character != type);                
                matchGroup.ForEach(group =>
                {
                    List<PlayerResults> scores = group.Select(p => p.Score).ToList();                    
                    var score = CalculateCharScores(scores).FirstOrDefault(p => p.Name == ((CharEnum)type).Valor);
                    if(score != null)
                    {
                        wins.Add(score.Wins);
                        losts.Add(score.Losts);
                        label.Add(group.Key);
                    }
                    
                });                
            }
            else if (IsRole(type))
            {
                results.RemoveAll(p => ((CharEnum)p.Info.Character).Role != GetValueByType(type));
                matchGroup.ForEach(group =>
                {
                    List<PlayerResults> scores = group.Select(p => p.Score).ToList();
                    var score = CalculateRoleScores(scores).FirstOrDefault(p => p.Name == GetValueByType(type));
                    wins.Add(score.Wins);
                    losts.Add(score.Losts);
                    label.Add(group.Key);
                });
            }
            else
            {
                matchGroup.ForEach(group =>
                {
                    List<PlayerResults> scores = group.Select(p => p.Score).ToList();
                    var score = CalculateUserScores(scores).FirstOrDefault(p => p.Name == user.Credentials.Username);
                    wins.Add(score.Wins);
                    losts.Add(score.Losts);
                    label.Add(group.Key);
                });
            }
            return new LineGraph(label, wins, losts);
        }

        private DateTime GetDateFromPeriod(int period)
        {
            if(period == ScoreLineGraphEnum.CURRENT_WEEK)
            {
                return DateTime.Now.AddDays(-7);
            }
            else if(period == ScoreLineGraphEnum.LAST_TWO_WEEK)
            {
                return DateTime.Now.AddDays(-14);
            }
            else if (period == ScoreLineGraphEnum.LAST_THREE_WEEK)
            {
                return DateTime.Now.AddDays(-21);
            }            
            else if (period == ScoreLineGraphEnum.LAST_THREE_MONTH)
            {
                return DateTime.Now.AddMonths(-3);
            }
            else if(period == ScoreLineGraphEnum.ALL_TIME)
            {
                return _start;
            }
            else
            {
                throw new ArgumentException($"period not supported : {period}");
            }

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
                    return "PLAYER";
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
    }
}
