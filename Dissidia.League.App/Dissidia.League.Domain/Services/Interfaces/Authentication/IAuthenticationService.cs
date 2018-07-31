using Dissidia.League.Domain.ValueObjects.Authentication;
using System.IO;

namespace Dissidia.League.Domain.Services.Interfaces.Authentication
{
    public interface IAuthenticationService
    {
        UserSession GetLoggedUser();
        bool AuthUser(string username, string password);
        string GetUserIdByUsername(string username);
        void RegisterUser(string username, string password, string email);
        Stream GetImage(string userId);
        Stream GetImageFromNick(string nickName);
        void SubmitUserImage(string userId, Stream image);
        string GetNicknameById(string id);
    }
}
