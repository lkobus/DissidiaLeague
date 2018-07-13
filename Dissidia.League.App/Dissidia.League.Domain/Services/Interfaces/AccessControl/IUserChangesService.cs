using Dissidia.League.Domain.Events.Matches;

namespace Dissidia.League.Domain.Services.Interfaces.AccessControl
{
    public interface IUserChangesService
    {
        void OnMatchResolved(object sender, OnMatchDoneArgs args);
    }
}
