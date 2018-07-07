using Dissidia.League.Domain.Entities.Interfaces;
using Dissidia.League.Domain.ValueObjects.Authentication;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.Domain.Entities.Gamification
{
    public class User : IEntity
    {
        [BsonId]
        public string Id { get; private set; }
        public Credentials Credentials { get; private set; }
        public string Email { get; private set; }
        public static UserFactory Factory => new UserFactory();

        private User()
        {
            Id = ObjectId.GenerateNewId().ToString();
        }

        public class UserFactory
        {
            public User Instance { get; private set; }

            public UserFactory() { }

            public UserFactory CreateUser(Credentials credentials, string email)
            {
                Instance = new User()
                {
                    Credentials = credentials,
                    Email = email
                };
                return this;
            }

        }
    }
}
