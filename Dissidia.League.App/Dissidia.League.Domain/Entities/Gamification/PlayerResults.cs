using Dissidia.League.Domain.Entities.Interfaces;
using Dissidia.League.Domain.ValueObjects.Match;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Dissidia.League.Domain.Entities.Gamification
{
    public class PlayerResults : IEntity
    {
        [BsonId]
        public string Id { get; private set; }
        public PlayerInfo Info { get; private set; }
        public bool Winner { get; private set; }
        public static PlayerResultsFactory Factory => new PlayerResultsFactory();

        private PlayerResults()
        {
            Id = ObjectId.GenerateNewId().ToString();
        }

        public class PlayerResultsFactory
        {

            public PlayerResults Instance { get; private set; }

            public PlayerResultsFactory()
            {

            }

            public PlayerResultsFactory CreateWin(PlayerInfo player)
            {
                Instance = new PlayerResults()
                {
                    Info = player,
                    Winner = true
                };
                return this;
            }

            public PlayerResultsFactory CreatLost(PlayerInfo player)
            {
                Instance = new PlayerResults()
                {
                    Info = player,
                    Winner = false
                };
                return this;
            }
        }

    }
}
