namespace Dissidia.League.Domain.ValueObjects.Gamification.Pontuation
{
    public class PlayerPontuation
    {
        public string Name { get; private set; }
        public int Wins { get; private set; }
        public int Losts { get; private set; }
        public double PercentualWins { get { return ((Wins * 100) / TotalMatches); } private set { } }
        public double PercentualLosts { get { return ((Losts * 100) / TotalMatches); } private set { } }
        public int TotalMatches { get { return Wins + Losts; } private set { } }

        public PlayerPontuation(string name, int wins, int losts)
        {
            Name = name;
            Wins = wins;
            Losts = losts;
        }

    }
}
