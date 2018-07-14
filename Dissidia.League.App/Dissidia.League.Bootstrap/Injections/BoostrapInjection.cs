using Dissidia.League.Domain.Infrastructure.Interfaces.Configuration;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.Services.Interfaces.Authentication;
using MongoDB.Driver;

namespace Dissidia.League.Bootstrap.Injections
{
    public class BoostrapInjection : IBootstrapInjection
    {
        public IInjectionService Services { get; set; }
        public IInjectionRepository Repositories { get; set; }        

        public BoostrapInjection() { }

        public BoostrapInjection(IGlobalConfiguration globalConfiguration)
        {
            var mongoClient = new MongoClient(globalConfiguration.Database.Host);
            Repositories = new InjectionRepository(mongoClient.GetDatabase(globalConfiguration.Database.Name), globalConfiguration.Database);
            Services = new ServicesInjection(globalConfiguration, Repositories);
        }        

    }
}
