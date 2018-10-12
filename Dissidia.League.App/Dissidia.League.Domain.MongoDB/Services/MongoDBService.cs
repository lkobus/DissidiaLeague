using MongoDB.Driver;
using System;

namespace Dissidia.League.Domain.MongoDB.Services
{
    public class MongoDBService
    {        
        public IMongoDatabase Database { get; private set; }
        private IMongoClient _client;

        private MongoDBService(string mongoURL, string databaseName)
        {
            _client = new MongoClient(mongoURL);                        
            Database = _client.GetDatabase(databaseName);
        }

        
    }
}
