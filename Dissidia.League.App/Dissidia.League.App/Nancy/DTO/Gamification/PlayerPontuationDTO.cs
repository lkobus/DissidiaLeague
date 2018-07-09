using Dissidia.League.Domain.ValueObjects.Gamification.Pontuation;

namespace Dissidia.League.App.Nancy.DTO
{
    public class PlayerPontuationDTO 
    {
        public string Name { get; private set; }
        public int Wins { get; private set; }
        public int Losts { get; private set; }
        public double PercentualWins { get; private set; }
        public double PercentualLosts { get; private set; }
        public int TotalMatches { get; private set; }

        public PlayerPontuationDTO(PlayerPontuation player)
        {
            Name = player.Name;
            Wins = player.Wins;
            Losts = player.Losts;
            PercentualLosts = player.PercentualLosts;
            PercentualWins = player.PercentualWins;
            TotalMatches = player.TotalMatches;
        }
    }
}
