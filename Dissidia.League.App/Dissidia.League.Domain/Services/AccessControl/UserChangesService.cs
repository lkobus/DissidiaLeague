using Dissidia.League.Domain.Entities.AccessControl;
using Dissidia.League.Domain.Enums.AccessControl;
using Dissidia.League.Domain.Events.Matches;
using Dissidia.League.Domain.Repositories.Interfaces.AccessControl;
using Dissidia.League.Domain.Services.Interfaces.AccessControl;
using static Dissidia.League.Domain.Entities.AccessControl.UserChange;

namespace Dissidia.League.Domain.Services.AccessControl
{
    public class UserChangesService : IUserChangesService
    {

        private IUserChangeRepository _changeRepository;

        public UserChangesService(IUserChangeRepository changeRepository)
        {
            _changeRepository = changeRepository;
        }

        public void OnMatchResolved(object sender, OnMatchDoneArgs args)
        {
            _changeRepository.Upsert(Factory.CreateChange(args.UserId, UserChangeEnum.MATCH_UPDATE).Instance);            
        }
    }
}
