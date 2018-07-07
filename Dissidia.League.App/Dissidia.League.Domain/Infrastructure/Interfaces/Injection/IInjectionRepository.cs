using Dissidia.League.Domain.Repositories.Interfaces;
using Dissidia.League.Domain.Repositories.Interfaces.Authentication;
using Dissidia.League.Domain.Repositories.Interfaces.Gamification;

namespace Dissidia.League.Domain.Infrastructure.Interfaces.Injection
{
    public interface IInjectionRepository
    {
        IMatchRepository MatchRepository { get; }
        IPlayerResultsRepository PlayersResultsRepository { get; }
        IUserRepository UserRepository { get; }
    }
}
