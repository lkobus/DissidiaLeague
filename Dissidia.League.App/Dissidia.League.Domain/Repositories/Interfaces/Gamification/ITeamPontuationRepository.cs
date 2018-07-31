using Dissidia.League.Domain.Entities.Gamification;
using Dissidia.League.Domain.ValueObjects.Gamification.Pontuation;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Repositories.Interfaces.Gamification
{
    public interface ITeamPontuationRepository : IBaseRepository<TeamPontuation>
    {
        List<string> GetTeamsPontuationsIdsFromMatchId(string teamId);        
    }
}
