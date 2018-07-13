using Dissidia.League.Domain.Events.Matches;
using static Dissidia.League.Domain.Events.Matches.OnMatchDoneArgs;

namespace Dissidia.League.Domain.Services.Interfaces
{
    public interface IOCRService
    {
        void OnMatchUploaded(object sender, OnMatchDoneArgs args);
        event OnMatchDoneEventHandler OnMatchProcessed;
    }
}
