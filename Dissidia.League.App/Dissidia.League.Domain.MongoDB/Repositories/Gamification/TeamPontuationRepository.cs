using Dissidia.League.Domain.Entities.Gamification;
using Dissidia.League.Domain.Enums.Entities;
using Dissidia.League.Domain.Repositories.Interfaces.Gamification;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.Domain.MongoDB.Repositories.Gamification
{
    public class TeamPontuationRepository : BaseRepository<TeamPontuation>, ITeamPontuationRepository
    {
        public TeamPontuationRepository(IMongoDatabase db) : base(EntityEnum.PLAYERSRESULTS, db)
        {

        }

        public List<string> GetTeamsPontuationsIdsFromMatchId(string matchId)
        {
            var result = _collection.FindAsync(p => p.MatchId == matchId);
            result.Wait();
            return result.Result.ToList()
                .Select(p => p.MatchId)
                .ToList();            
        }
    }
}
