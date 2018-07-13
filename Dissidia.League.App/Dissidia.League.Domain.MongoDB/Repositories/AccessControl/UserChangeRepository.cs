using Dissidia.League.Domain.Entities.AccessControl;
using Dissidia.League.Domain.Enums.Entities;
using Dissidia.League.Domain.Repositories.Interfaces.AccessControl;
using MongoDB.Driver;
namespace Dissidia.League.Domain.MongoDB.Repositories.AccessControl
{
    public class UserChangeRepository : BaseRepository<UserChange>, IUserChangeRepository
    {
        public UserChangeRepository(IMongoDatabase db) : base(EntityEnum.USER_CHANGE, db)
        {
        }
    }
}
