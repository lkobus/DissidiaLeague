using Dissidia.League.Domain.Events.Matches;
using Dissidia.League.Domain.ValueObjects.Gamification.Pontuation;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Services.Interfaces.Gamification
{
    public interface IPlayerPontuationService
    {
        void DeleteByMatchId(string matchId);
        void OnMatchResolved(object sender, OnMatchDoneArgs args);
        List<PlayerPontuation> GetPlayersPontuations();
    }
}
