using Dissidia.League.Domain.Entities.Dissidia;
using Dissidia.League.Domain.Enums.Entities;
using Dissidia.League.Domain.Repositories.Interfaces.Dissidia;
using MongoDB.Driver;
using System.IO;
using System.Linq;

namespace Dissidia.League.Domain.MongoDB.Repositories.Dissidia
{
    public class TeamRepository : BaseRepository<Team>,  ITeamRepository
    {        

        public TeamRepository(IMongoDatabase db, DirectoryInfo imageDirectory) : base(EntityEnum.TEAM, db, imageDirectory)
        {
         
        }        

        public Team GetTeamFromPlayerName(string playerName)
        {
            var result = _collection.FindAsync(p => p.Members.FirstOrDefault(c => c == playerName) != null);
            result.Wait();
            return result.Result.FirstOrDefault();            
        }

        public Team GetTeamFromUser(string userId)
        {
            var task = _collection.FindAsync(p => p.Members.Contains(userId));
            task.Wait();
            return task.Result.FirstOrDefault();            
        }

    }
}
