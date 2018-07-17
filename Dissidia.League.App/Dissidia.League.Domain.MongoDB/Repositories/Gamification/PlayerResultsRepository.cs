﻿using Dissidia.League.Domain.Entities.Gamification;
using Dissidia.League.Domain.Enums.Entities;
using Dissidia.League.Domain.Repositories.Interfaces.Gamification;
using MongoDB.Driver;
using System.Collections.Generic;

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

        public List<PlayerResults> GetByUser(string username)
        {
            var task = _collection.FindAsync(p => p.Info.Name == username);
            task.Wait();
            return task.Result.ToList();
        }
    }

}
