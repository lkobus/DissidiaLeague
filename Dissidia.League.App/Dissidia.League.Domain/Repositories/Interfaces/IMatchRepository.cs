using Dissidia.League.Domain.Entities;
using System;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Repositories.Interfaces
{
    public interface IMatchRepository : IBaseRepository<Match>
    {
        List<Match> GetAllMatchesFrom(string player);
        List<Match> GetMatchBetween(DateTime from, DateTime until);
        List<Match> GetMatchesFrom(DateTime from);
        List<Match> GetTeamMatches(string teamId);
        List<Match> GetAllPending();
        List<Match> GetAllConcluded();
    }
}
