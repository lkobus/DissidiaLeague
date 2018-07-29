using Dissidia.League.Domain.Entities;
using Dissidia.League.Domain.Entities.Gamification;
using System;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Repositories.Interfaces.Gamification
{
    public interface IPlayerResultsRepository : IBaseRepository<PlayerResults>
    {
        void DeleteByMatchId(string matchId);
        List<PlayerResults> GetByUser(User user);
        List<PlayerResults> GetByUser(User user, List<Match> matchesId);
    }
}
