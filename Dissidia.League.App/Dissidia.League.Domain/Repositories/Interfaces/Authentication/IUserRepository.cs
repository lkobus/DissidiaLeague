using Dissidia.League.Domain.Entities.Gamification;

namespace Dissidia.League.Domain.Repositories.Interfaces.Authentication
{
    public interface IUserRepository : IBaseRepository<User>
    {
        User GetUserByLogin(string username);
    }
}
