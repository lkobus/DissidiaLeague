using Dissidia.League.Domain.Entities.Dissidia;
using Dissidia.League.Domain.Repositories.Interfaces.IO;
using System.IO;

namespace Dissidia.League.Domain.Repositories.Interfaces.Dissidia
{
    public interface ITeamRepository : IBaseRepository<Team>, IImageRepository
    {        
        Team GetTeamFromPlayerName(string playerName);
        Team GetTeamFromUser(string userId);
    }
}
