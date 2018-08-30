using Dissidia.League.Domain.Entities.Gamification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.Domain.ValueObjects.Matche
{
    public class MatchScoreGroup
    {

        public Entities.Match Match { get; private set; }
        public PlayerResults Score { get; private set; }

        public MatchScoreGroup(Entities.Match match, PlayerResults score)
        {
            Match = match;
            Score = score;
        }

    }
}
