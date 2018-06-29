using Dissidia.League.Domain.ValueObjects.Authentication;

namespace Dissidia.League.Domain.Services.Interfaces.Authentication
{
    public interface IAuthenticationService
    {
        UserSession GetLoggedUser();
        bool AuthUser();
    }
}
