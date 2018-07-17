using Dissidia.League.Domain.Entities.Interfaces;
using Dissidia.League.Domain.Enums.Dissidia;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Entities.Dissidia
{
    public class Team : IEntity
    {
        [BsonId]
        public string Id { get; private set; }
        public static TeamFactory Factory => new TeamFactory();        
        public List<string> Members { get; private set; }        
        public string Alias { get; private set; }
        public string Founder { get; private set; }

        public int Status
        {
            get
            {
                if(Members.Count > 0)
                {
                    return TeamStatusEnum.ACTIVE;
                }
                else
                {
                    return TeamStatusEnum.INACTIVE;
                }
                
            }
            private set { }
        }

        private Team()
        {

        }

        public class TeamFactory
        {            
            public Team Instance { get; private set; }

            public TeamFactory()
            {

            }

            public TeamFactory NewTeam(string founderId, string name, string alias)
            {
                Instance = new Team()
                {
                    Founder = founderId,
                    Members = new List<string>(),
                    Alias = alias,
                    Id = name
                };
                return this;
            }                       

        }
    }
}
