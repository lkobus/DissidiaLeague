using Dissidia.League.Domain.Repositories.Interfaces;
using Dissidia.League.Domain.Repositories.Interfaces.AccessControl;
using Dissidia.League.Domain.Repositories.Interfaces.Authentication;
using Dissidia.League.Domain.Repositories.Interfaces.Dissidia;
using Dissidia.League.Domain.Repositories.Interfaces.Gamification;

namespace Dissidia.League.Domain.Infrastructure.Interfaces.Injection
{
    public interface IInjectionRepository
    {
        IMatchRepository Match { get; }
        IPlayerResultsRepository PlayersResults { get; }
        IUserRepository User { get; }
        IUserChangeRepository UserChange { get; }
        ITeamRepository Team { get; }
        ITeamPontuationRepository TeamPontuation { get; }
    }
}
