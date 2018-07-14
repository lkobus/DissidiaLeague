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
        public IMatchesService MatchService { get; private set; }
        public IOCRService OCRService { get; private set; }
        public IPlayerPontuationService PlayerPontuationService { get; private set; }
        public IAuthenticationService AuthenticationService { get; private set; }
        public IUserChangesService UserChangesService { get; private set; }
        public ITeamService TeamService { get; private set; }

        public ServicesInjection(IGlobalConfiguration globalConfig, IInjectionRepository repositories)
        {
            MatchService = new MatchService(globalConfig.OCR.ImageFileDirectory, repositories.MatchRepository);
            OCRService = new MatchOCRService(globalConfig.OCR);
            PlayerPontuationService = new PlayerPontuationService(repositories.PlayersResultsRepository);
            UserChangesService = new UserChangesService(repositories.UserChangeRepository);
            TeamService = new TeamService(repositories.TeamRepository);
            SetupEvents();          
        }                

        private void SetupEvents()
        {
            MatchService.OnMatchUploaded += OCRService.OnMatchUploaded;
            OCRService.OnMatchProcessed += MatchService.OnMatchProcessed;
            MatchService.OnMatchResolved += PlayerPontuationService.OnMatchResolved;
            MatchService.OnMatchResolved += UserChangesService.OnMatchResolved;
        }

        public void RegisterAuthentication(IAuthenticationService authenticationService)
        {
            AuthenticationService = authenticationService;            
        }
    }
}
