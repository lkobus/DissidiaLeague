using Dissidia.League.Domain.Entities.Dissidia;
using System.IO;

namespace Dissidia.League.Domain.Repositories.Interfaces.Dissidia
{
    public interface ITeamRepository : IBaseRepository<Team>
    {
        void SaveImage(Stream stream, string teamId);
        Stream GetImage(string teamId);
    }
}
