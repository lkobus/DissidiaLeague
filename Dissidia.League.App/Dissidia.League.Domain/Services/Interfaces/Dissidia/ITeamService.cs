using Dissidia.League.Domain.Entities.Dissidia;
using System.Collections.Generic;
using System.IO;

namespace Dissidia.League.Domain.Services.Interfaces.Dissidia
{
    public interface ITeamService
    {
        void CreateTeam(string founderId, string teamName, string alias);
        void InvitePlayer(string email, string teamId);
        void AddMembers(string teamId, List<string> membersId);
        Team GetTeam(string teamId);
        Team GetTeamFromUser(string userId);
        void Quit(string teamId, string memberId);
        Stream GetImage(string teamId);
        void SubmitTeamImage(string teamId, Stream image);
        void JoinTeam(string userId, string token, string teamId);
        
    }
}
    