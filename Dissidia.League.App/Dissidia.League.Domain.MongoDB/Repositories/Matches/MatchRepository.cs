using Dissidia.League.Domain.Entities;
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
    }
}
