using System.Collections.Generic;
using System.IO;

namespace Dissidia.League.Domain.Services.Interfaces.Dissidia
{
    public interface ITeamService
    {
        void CreateTeam(string founder, string teamId, string teamName);
        void AddMembers(string teamId, List<string> membersId);
        void Quit(string teamId, string memberId);
        void SubmitTeamImage(string teamId, Stream image);
        Stream GetTeamImage(string teamId);
    }
}
    