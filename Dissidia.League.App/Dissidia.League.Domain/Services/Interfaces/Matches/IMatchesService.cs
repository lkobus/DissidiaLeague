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
        Stream GetImage(string matchId);
        Match GetMatch(string id);
        void UpdateMatch(List<PlayerInfo> playersTeamWinner, List<PlayerInfo> playersTeamLooser, string userId, string matchId);
        List<Match> GetAll();

        event OnMatchDoneEventHandler OnMatchUploaded;
        event OnMatchDoneEventHandler OnMatchResolved;
    }
}
