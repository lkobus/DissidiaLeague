using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.MongoDB.Repositories.AccessControl;
using Dissidia.League.Domain.MongoDB.Repositories.Authentication;
using Dissidia.League.Domain.MongoDB.Repositories.Gamification;
using Dissidia.League.Domain.MongoDB.Repositories.Matches;
using Dissidia.League.Domain.Repositories.Interfaces;
using Dissidia.League.Domain.Repositories.Interfaces.AccessControl;
using Dissidia.League.Domain.Repositories.Interfaces.Authentication;
using Dissidia.League.Domain.Repositories.Interfaces.Gamification;
using MongoDB.Driver;

namespace Dissidia.League.Bootstrap.Injections
{
    public class InjectionRepository : IInjectionRepository
    {
        public IMatchRepository MatchRepository { get; private set; }
        public IPlayerResultsRepository PlayersResultsRepository { get; private set; }
        public IUserRepository UserRepository { get; private set; }
        public IUserChangeRepository UserChangeRepository { get; private set; }

        public InjectionRepository(IMongoDatabase database)
        {
            MatchRepository = new MatchRepository(database);
            PlayersResultsRepository = new PlayerResultsRepository(database);
            UserRepository = new UserRepository(database);
            UserChangeRepository = new UserChangeRepository(database);
        }

        

    }
}
