using Dissidia.League.Domain.Entities.Interfaces;
using Dissidia.League.Domain.Enums.AccessControl;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Dissidia.League.Domain.Entities.AccessControl
{
    public class UserChange : IEntity
    {
        [BsonId]
        public string Id { get; private set; }
        public int Type { get; private set; }
        public string UserId { get; private set; }

        public static UserChangeFactory Factory => new UserChangeFactory();

        private UserChange()
        {
            Id = ObjectId.GenerateNewId().ToString();
        }

        public class UserChangeFactory
        {
            public UserChange Instance { get; private set; }

            public UserChangeFactory() { }
            
            public UserChangeFactory CreateChange(string userId, UserChangeEnum changeEnum)
            {
                Instance = new UserChange()
                {
                    UserId = userId,
                    Type = changeEnum
                };
                return this;
            }        

        }

    }
}
