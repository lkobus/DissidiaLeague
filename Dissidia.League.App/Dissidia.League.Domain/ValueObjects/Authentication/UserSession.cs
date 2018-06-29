using Dissidia.League.Domain.Enums.Authentication;

namespace Dissidia.League.Domain.ValueObjects.Authentication
{
    public class UserSession
    {
        public string UserId { get; private set; }
        public int Status { get; private set; }

        public UserSession(AuthenticationStatusEnum status, string userId)
        {
            UserId = userId;
            Status = status;
        }

    }
}
