using Dissidia.League.Domain.Events.Matches;

namespace Dissidia.League.Domain.Services.Interfaces.Gamification
{
    public interface IPlayerPontuationService
    {
        void OnMatchResolved(object sender, OnMatchDoneArgs args);
    }
}
