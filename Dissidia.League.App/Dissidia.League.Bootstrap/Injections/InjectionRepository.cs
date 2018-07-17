using Dissidia.League.Domain.Infrastructure.Interfaces.Configuration;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.MongoDB.Repositories.AccessControl;
using Dissidia.League.Domain.MongoDB.Repositories.Authentication;
using Dissidia.League.Domain.MongoDB.Repositories.Dissidia;
using Dissidia.League.Domain.MongoDB.Repositories.Gamification;
using Dissidia.League.Domain.MongoDB.Repositories.Matches;
using Dissidia.League.Domain.Repositories.Interfaces;
using Dissidia.League.Domain.Repositories.Interfaces.AccessControl;
using Dissidia.League.Domain.Repositories.Interfaces.Authentication;
using Dissidia.League.Domain.Repositories.Interfaces.Dissidia;
using Dissidia.League.Domain.Repositories.Interfaces.Gamification;
using MongoDB.Driver;
using System.IO;

namespace Dissidia.League.Bootstrap.Injections
{
    public class InjectionRepository : IInjectionRepository
    {
        public IMatchRepository Match { get; private set; }
        public IPlayerResultsRepository PlayersResults { get; private set; }
        public IUserRepository User { get; private set; }
        public IUserChangeRepository UserChange { get; private set; }
        public ITeamRepository Team { get; private set; }
        public ITeamPontuationRepository TeamPontuation { get; private set; }

        public InjectionRepository(IMongoDatabase database, IDatabaseConfiguration configuration)
        {
            Match = new MatchRepository(database);
            PlayersResults = new PlayerResultsRepository(database);
            User = new UserRepository(database, new DirectoryInfo(configuration.UserImageFolder));
            UserChange = new UserChangeRepository(database);
            Team = new TeamRepository(database, new DirectoryInfo(configuration.TeamImageFolder));
            TeamPontuation = new TeamPontuationRepository(database);
        }

        

    }
}
