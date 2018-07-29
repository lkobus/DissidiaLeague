using Dissidia.League.Domain.Enums.Gamification;

namespace Dissidia.League.Domain.ValueObjects.Gamification.Pontuation
{
    public class ScorePontuation
    {
        public string Name { get; private set; }
        public int ScoreType { get; private set; }
        public int Wins { get; private set; }
        public int Losts { get; private set; }
        public double PercentualWins { get { return ((Wins * 100) / TotalMatches); } private set { } }
        public double PercentualLosts { get { return ((Losts * 100) / TotalMatches); } private set { } }
        public int TotalMatches { get { return Wins + Losts; } private set { } }

        public ScorePontuation(string name, int wins, int losts, ScoreTypeEnum scoreType)
        {
            Name = name;
            Wins = wins;
            Losts = losts;
            ScoreType = scoreType;
        }

    }
}
