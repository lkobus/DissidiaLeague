using Dissidia.League.Domain.Infrastructure.Interfaces.Configuration;

namespace Dissidia.League.Bootstrap.Configuration
{
    public class DatabaseConfiguration : IDatabaseConfiguration
    {
        public string Name { get; private set; }
        public string Host { get; private set; }

        public DatabaseConfiguration(string name, string host)
        {
            Name = name;
            Host = host;
        }       
    }
}
