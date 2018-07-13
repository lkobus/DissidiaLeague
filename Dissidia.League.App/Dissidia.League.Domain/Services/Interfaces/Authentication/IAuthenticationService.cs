using Dissidia.League.Domain.ValueObjects.Authentication;

namespace Dissidia.League.Domain.Services.Interfaces.Authentication
{
    public interface IAuthenticationService
    {
        UserSession GetLoggedUser();
        bool AuthUser(string username, string password);
        string GetUserIdByUsername(string username);
        void RegisterUser(string username, string password, string email);
    }
}
