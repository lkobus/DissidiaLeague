using Dissidia.League.Domain.Entities.Gamification;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Repositories.Interfaces.Gamification
{
    public interface IPlayerResultsRepository : IBaseRepository<PlayerResults>
    {
        void DeleteByMatchId(string matchId);
        List<PlayerResults> GetByUser(string username);
    }
}
