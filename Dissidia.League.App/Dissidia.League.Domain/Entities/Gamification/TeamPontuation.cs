using Dissidia.League.Domain.Entities.Interfaces;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Entities.Gamification
{
    public class TeamPontuation : IEntity
    {
        [BsonId]
        public string Id { get; private set; }
        public string MatchId { get; private set; }
        public List<string> Members { get; private set; }
        public bool Winner { get; private set; }
        public int Points { get; private set; }
        public string TeamId { get; private set; }
        public static TeamResultsFactory Factory => new TeamResultsFactory();

        private TeamPontuation() { Id = ObjectId.GenerateNewId().ToString(); }

        public class TeamResultsFactory
        {
            public TeamPontuation Instance { get; private set; }

            public TeamResultsFactory() { }

            public TeamResultsFactory CreateTeamWon(List<string> members, int points, string matchId, string teamId)
            {
                return CreateTeam(members, points, matchId, teamId, true);
            }

            public TeamResultsFactory CreateTeamLooser(List<string> members, int points, string matchId, string teamId)
            {
                return CreateTeam(members, points, matchId, teamId, false);
            }            

            private TeamResultsFactory CreateTeam(List<string> members, int points, string matchId, string teamId,
                bool winner)
            {
                Instance = new TeamPontuation()
                {
                    Members = members,
                    Points = points,
                    MatchId = matchId,
                    Winner = winner,
                    TeamId = teamId
                };
                return this;
            }

            
        }

    }
}
