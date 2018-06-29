using Dissidia.League.Domain.Entities;
using Dissidia.League.Domain.Events.Matches;
using Dissidia.League.Domain.ValueObjects.Match;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using static Dissidia.League.Domain.Events.Matches.OnMatchDoneArgs;

namespace Dissidia.League.Domain.Services.Interfaces
{
    public interface IMatchesService
    {
        void OnMatchProcessed(object sender, OnMatchDoneArgs args);
        Task RegisterMatchAsync(Stream stream);
        void RegisterMatches(List<Stream> stream);
        void MarkMatchAsResolved(string matchId, List<PlayerInfo> winners, List<PlayerInfo> loosers);

        List<Match> GetAll();

        event OnMatchDoneEventHandler OnMatchDone;
        event OnMatchDoneEventHandler OnMatchResolved;
    }
}
