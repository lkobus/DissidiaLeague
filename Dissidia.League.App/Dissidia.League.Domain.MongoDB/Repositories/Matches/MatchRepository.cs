using System;
using System.Collections.Generic;
using Dissidia.League.Domain.Entities;
using Dissidia.League.Domain.Enums.Dissidia;
using Dissidia.League.Domain.Enums.Entities;
using Dissidia.League.Domain.Repositories.Interfaces;
using MongoDB.Driver;

namespace Dissidia.League.Domain.MongoDB.Repositories.Matches
{
    public class MatchRepository : BaseRepository<Match>, IMatchRepository
    {
        public MatchRepository(IMongoDatabase db) : base(EntityEnum.MATCH, db)
        {

        }

        public List<Match> GetMatchBetween(DateTime from, DateTime until)
        {
            var task = _collection.FindAsync(p => p.Date >= from && p.Date <= until);
            task.Wait();
            return task.Result.ToList();            
        }

        public List<Match> GetMatchesFrom(DateTime from)
        {
            var task = _collection.FindAsync(p => p.Date >= from);
            task.Wait();
            return task.Result.ToList();
        }

        public List<Match> GetTeamMatches(string teamId)
        {
            var task = _collection.FindAsync(p => (p.TeamA == teamId || p.TeamB == teamId) && p.Type == MatchTypeEnum.TEAM.Codigo);
            task.Wait();
            return task.Result.ToList();            
        }
    }
}
