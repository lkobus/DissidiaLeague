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
        public string Name { get; private set; }
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

            public TeamFactory NewTeam(string founderId, List<string> members, string name)
            {
                Instance = new Team()
                {
                    Founder = founderId,
                    Members = members,
                    Name = name
                };
                return this;
            }
            
        }
    }
}
