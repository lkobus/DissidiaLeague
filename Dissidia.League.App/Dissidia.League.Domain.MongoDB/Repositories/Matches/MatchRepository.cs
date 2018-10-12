using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dissidia.League.Domain.Entities;
using Dissidia.League.Domain.Enums.Dissidia;
using Dissidia.League.Domain.Enums.Entities;
using Dissidia.League.Domain.Enums.Matches;
using Dissidia.League.Domain.Repositories.Interfaces;
using MongoDB.Driver;

namespace Dissidia.League.Domain.MongoDB.Repositories.Matches
{
    public class MatchRepository : BaseRepository<Match>, IMatchRepository
    {
        public MatchRepository(IMongoDatabase db) : base(EntityEnum.MATCH, db)
        {

        }

        public List<Match> GetAllConcluded()
        {
            return GetByStatus(MatchStatusEnum.CONCLUDED);
        }

        public List<Match> GetAllPending()
        {
            return GetByStatus(MatchStatusEnum.PENDING);
        }

        private List<Match> GetByStatus(MatchStatusEnum status)
        {
            var task = _collection.FindAsync(p => p.Status == status);
            task.Wait();
            return task.Result.ToList();
        }

        public List<Match> GetMatchBetween(DateTime from, DateTime until)
        {
            var task = _collection.FindAsync(p => p.Date >= from.ToUniversalTime() && p.Date <= until.ToUniversalTime());
            task.Wait();
            return task.Result.ToList();            
        }

        public List<Match> GetMatchesFrom(DateTime from)
        {
            var task = _collection.FindAsync(p => p.Date >= from.ToUniversalTime());
            task.Wait();
            return task.Result.ToList();
        }

        public List<Match> GetTeamMatches(string teamId)
        {
            var task = _collection.FindAsync(p => (p.TeamA == teamId || p.TeamB == teamId) && p.Type == MatchTypeEnum.TEAM.Codigo);
            task.Wait();
            return task.Result.ToList();            
        }

        public List<Match> GetAllMatchesFrom(string player)
        {
            var elemMatchFilter = Builders<Match>
                .Filter
                .ElemMatch(x => x.PlayersTeamLooser, x => x.Name == player);

            var elemMatchFilter2 = Builders<Match>
                .Filter
                .ElemMatch(x => x.PlayersTeamWinner, x => x.Name == player);
            var task1 = _collection.FindAsync(elemMatchFilter);
            var task2 = _collection.FindAsync(elemMatchFilter2);
            Task.WaitAll(task1, task2);
            
            return task1.Result.ToList().Concat(task2.Result.ToList()).ToList();            
        }
    }
}
