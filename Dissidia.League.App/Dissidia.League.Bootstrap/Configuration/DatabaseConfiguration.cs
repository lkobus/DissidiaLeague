using Dissidia.League.Domain.Infrastructure.Interfaces.Configuration;
using System.Configuration;

namespace Dissidia.League.Bootstrap.Configuration
{
    public class DatabaseConfiguration : IDatabaseConfiguration
    {
        public string Name { get; private set; }
        public string Host { get; private set; }
        public string TeamImageFolder { get; private set; }
        public string UserImageFolder { get; private set; }

        public DatabaseConfiguration(string name, string host)
        {
            TeamImageFolder = ConfigurationManager.AppSettings["TeamImageFolder"];
            UserImageFolder = ConfigurationManager.AppSettings["UserImageFolder"];
            Name = name;
            Host = host;
        }       
    }
}
