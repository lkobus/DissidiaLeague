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
        private int _allMatches = -1;
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

        public List<ScorePontuation> GetSoloBestDuosPontuation(int minMatches, int view)
        {
            var result = new List<ScorePontuation>();
            var matches = _matchRepository.GetAllConcluded();
            var last = 1;
            var winners = new List<IGrouping<string, Entities.Match>>();
            var loosers = new List<IGrouping<string, Entities.Match>>();
            for (var i = 0; i < 2; i++)
            {

                winners = matches.GroupBy(p =>
                    string.Join(",", SelectByView(view, p.PlayersTeamWinner).OrderBy(c => c).ToArray()).Split(',')[i] + "," +
                    string.Join(",", SelectByView(view, p.PlayersTeamWinner).OrderBy(c => c).ToArray()).Split(',')[last]
                ).Concat(winners).ToList();

                loosers = matches.GroupBy(p =>
                    string.Join(",", SelectByView(view, p.PlayersTeamLooser).OrderBy(c => c).ToArray()).Split(',')[i] + "," +
                    string.Join(",", SelectByView(view, p.PlayersTeamLooser).OrderBy(c => c).ToArray()).Split(',')[last]
                ).Concat(loosers).ToList();


                if (last == 1)
                {
                    last += 1;
                    i--;
                }
            }            
            return CheckLimitScores(CalculateSoloScorePontuation(winners, loosers), minMatches);
        }

        private IEnumerable<string> SelectByView(int view, IEnumerable<PlayerInfo> players)
        {
            if(view == ViewEnum.PLAYER)
            {
                return players.Select(p => p.Name);
            }
            else if(view == ViewEnum.CHAR)
            {
                return players.Select(p => ((CharEnum)p.Character).Valor);
            }
            else
            {
                return players.Select(p => ((CharEnum)p.Character).Role);
            }
        }

        private List<ScorePontuation> CheckLimitScores(List<ScorePontuation> scores, int minMatches)
        {            
            if (_allMatches != minMatches)
            {
                scores = scores.Where(p => p.TotalMatches > minMatches).ToList();
            }
            return scores;
        }

        public List<ScorePontuation> GetSoloBestDuosPontuation(int view)
        {
            return GetSoloBestDuosPontuation(_allMatches, view);
        }

        public List<ScorePontuation> GetSoloTeamsPontuations(int minMatches, int view)
        {
            var result = new List<ScorePontuation>();
            var matches = _matchRepository.GetAllConcluded();

            var winners = matches.GroupBy(p =>
                string.Join(",", SelectByView(view, p.PlayersTeamWinner).OrderBy(c => c).ToArray()
                )
            );
            var loosers = matches.GroupBy(p =>
                string.Join(",", SelectByView(view, p.PlayersTeamLooser).OrderBy(c => c).ToArray())
            );            
            return CheckLimitScores(CalculateSoloScorePontuation(winners, loosers), minMatches);            
        }

        public List<ScorePontuation> GetSoloTeamsPontuations(int view)
        {
            return GetSoloTeamsPontuations(_allMatches, view);
        }

        private List<ScorePontuation> CalculateSoloScorePontuation(IEnumerable<IGrouping<string, Entities.Match>> winners,
            IEnumerable<IGrouping<string, Entities.Match>> loosers)
        {
            var result = new List<ScorePontuation>();
            var allTeams = winners.Select(p => p.Key)
                .Concat(loosers.Select(p => p.Key))
                .DistinctBy(p => p);

            var r = new Dictionary<string, dynamic>();
            winners.ForEach(w =>
            {
                var winKey = w.Key + "|w";
                if (r.ContainsKey(winKey))
                {
                    r[winKey] = r[winKey] + w.Count();
                } else
                {
                    r.Add(winKey, w.Count());
                }
            });
            loosers.ForEach(l =>
            {
                var lossKey = l.Key + "|l";
                if (r.ContainsKey(lossKey))
                {
                    r[lossKey] = r[lossKey] + l.Count();
                } else
                {
                    r.Add(lossKey, l.Count());
                }
            });
            var oi = new List<ScorePontuation>();
            r.Keys.Select(p => p.Split('|')[0]).DistinctBy(p => p).ForEach(p =>
            {
                var w = 0;
                var l = 0;
                if (r.ContainsKey(p + "|w")) { w = r[p + "|w"]; }
                if (r.ContainsKey(p + "|l")) { l = r[p + "|l"]; }
                oi.Add(new ScorePontuation(p, w, l, ScoreTypeEnum.TEAM));
            });
            /*
            allTeams.ForEach(team =>
            {
                if(!IsEmptyTeam(team))
                {
                    var w = GetCountByTeam(team, winners);
                    var l = GetCountByTeam(team, loosers);
                    result.Add(new ScorePontuation(team, w, l, ScoreTypeEnum.TEAM));
                }                
            });*/
            return oi;
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

        public PositionPontuation GetPlayerPositionPontuation(string id)
        {
            var username = _userRepository.GetById(id).Credentials.Username;
            var allMatchesFromThisPlayer = _matchRepository.GetAllMatchesFrom(username);
            var posicoes = new List<int>() { 0, 0, 0, 0, 0, 0 };            
            var total = allMatchesFromThisPlayer.Count;

            allMatchesFromThisPlayer.ForEach(match =>
            {
                var ordem = match.PlayersTeamLooser.Concat(match.PlayersTeamWinner).OrderByDescending(p => p.Points);
                posicoes[ordem.ToList().FindIndex(p => p.Name == username)]++;
                
            });

            return new PositionPontuation(
                CalculatePercent(total, posicoes[0]),
                CalculatePercent(total, posicoes[1]),
                CalculatePercent(total, posicoes[2]),
                CalculatePercent(total, posicoes[3]),
                CalculatePercent(total, posicoes[4]),
                CalculatePercent(total, posicoes[5])
                );
        }

        private int CalculatePercent(int total, int current)
        {
            return (current * 100) / total;
        }
    }
}
