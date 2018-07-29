using Dissidia.League.Domain.Entities;
using Dissidia.League.Domain.Entities.Gamification;
using Dissidia.League.Domain.Enums.Entities;
using Dissidia.League.Domain.Repositories.Interfaces.Gamification;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Dissidia.League.Domain.MongoDB.Repositories.Gamification
{
    public class PlayerResultsRepository : BaseRepository<PlayerResults>, IPlayerResultsRepository
    {
        public PlayerResultsRepository(IMongoDatabase db) : base(EntityEnum.PLAYERSRESULTS, db)
        {

        }  

        public void DeleteByMatchId(string matchId)
        {
            _collection.DeleteMany(p => p.MatchId == matchId);            
        }

        public List<PlayerResults> GetByUser(User username)
        {
            var task = _collection.FindAsync(p => p.Info.Name == username.Credentials.Username);
            task.Wait();
            return task.Result.ToList();
        }

        public List<PlayerResults> GetByUser(User user, List<Match> matchesId)
        {
            if(matchesId.Count == 0)
            {
                return new List<PlayerResults>();
            }            
            var task = _collection.FindAsync(p => p.Info.Name == user.Credentials.Username);
            task.Wait();                
            return task.Result.ToList()
                .Where(p => matchesId.Exists(c => c.Id == p.MatchId))
                .ToList();
            
            
        }
    }

}
