using Dissidia.League.App.OCR.Services;
using Dissidia.League.Domain.Infrastructure.Interfaces.Configuration;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.Services.AccessControl;
using Dissidia.League.Domain.Services.Dissidia;
using Dissidia.League.Domain.Services.Gamification;
using Dissidia.League.Domain.Services.Interfaces;
using Dissidia.League.Domain.Services.Interfaces.AccessControl;
using Dissidia.League.Domain.Services.Interfaces.Authentication;
using Dissidia.League.Domain.Services.Interfaces.Dissidia;
using Dissidia.League.Domain.Services.Interfaces.Gamification;
using Dissidia.League.Domain.Services.Matches;

namespace Dissidia.League.Bootstrap.Injections
{
    public class ServicesInjection : IInjectionService
    {
        public IMatchesService Match { get; private set; }
        public IOCRService OCR { get; private set; }
        public IPlayerPontuationService PlayerPontuation { get; private set; }
        public IAuthenticationService Authentication { get; private set; }
        public IUserChangesService UserChangesService { get; private set; }
        public ITeamService Team { get; private set; }
        public ITeamPontuationService TeamPontuation { get; private set; }
        private IInviteService _invite;

        public ServicesInjection(IGlobalConfiguration globalConfig, IInjectionRepository repositories)
        {
            _invite = new InviteService(globalConfig);
            Match = new MatchService(globalConfig.OCR.ImageFileDirectory, repositories.Match);
            OCR = new MatchOCRService(globalConfig.OCR);
            PlayerPontuation = new PlayerPontuationService(repositories.PlayersResults, repositories.User, repositories.Match);
            UserChangesService = new UserChangesService(repositories.UserChange);
            
            Team = new TeamService(repositories.Team, _invite, repositories.User);
            TeamPontuation = new TeamPontuationService(repositories.TeamPontuation, repositories.Team, PlayerPontuation);
            SetupEvents();          
        }                

        private void SetupEvents()
        {
            Match.OnMatchUploaded += OCR.OnMatchUploaded;
            OCR.OnMatchProcessed += Match.OnMatchProcessed;
            Match.OnMatchResolved += PlayerPontuation.OnMatchResolved;
            Match.OnMatchResolved += UserChangesService.OnMatchResolved;
            Match.OnMatchResolved += TeamPontuation.OnMatchResolved;
        }

        public void RegisterAuthentication(IAuthenticationService authenticationService)
        {
            Authentication = authenticationService;            
        }
    }
}
