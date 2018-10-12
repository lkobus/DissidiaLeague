using Dissidia.League.Domain.Entities.Gamification;
using Dissidia.League.Domain.Enums.Entities;
using Dissidia.League.Domain.Repositories.Interfaces.Authentication;
using MongoDB.Driver;
using System.IO;
using System.Linq;

namespace Dissidia.League.Domain.MongoDB.Repositories.Authentication
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        public UserRepository(IMongoDatabase db, DirectoryInfo imageDir) : base(EntityEnum.USER, db, imageDir)
        {

        }

        public User GetUserByLogin(string username)
        {            
            var query = _collection.FindAsync(p => p.Credentials.Username == username);
            query.Wait();
            return query.Result.FirstOrDefault();            
        }
    }
}
