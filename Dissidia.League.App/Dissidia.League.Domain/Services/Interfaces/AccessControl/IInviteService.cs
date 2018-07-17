namespace Dissidia.League.Domain.Services.Interfaces.AccessControl
{
    public interface IInviteService
    {
        void Invite(string destination, string bodyMessage, string subject);
        string GenerateTokenUrl(string teamId);
        bool BurnToken(string token);
        
    }
}
