using Dissidia.League.Domain.Entities.Gamification;
using Dissidia.League.Domain.Repositories.Interfaces.IO;

namespace Dissidia.League.Domain.Repositories.Interfaces.Authentication
{
    public interface IUserRepository : IBaseRepository<User>, IImageRepository
    {        
        User GetUserByLogin(string username);
    }
}
