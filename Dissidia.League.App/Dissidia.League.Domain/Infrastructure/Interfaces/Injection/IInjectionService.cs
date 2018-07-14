using Dissidia.League.Domain.Services.Interfaces;
using Dissidia.League.Domain.Services.Interfaces.Authentication;
using Dissidia.League.Domain.Services.Interfaces.Dissidia;
using Dissidia.League.Domain.Services.Interfaces.Gamification;

namespace Dissidia.League.Domain.Infrastructure.Interfaces.Injection
{
    public interface IInjectionService
    {
        IMatchesService MatchService { get; }
        IOCRService OCRService { get; }
        IPlayerPontuationService PlayerPontuationService { get; }
        IAuthenticationService AuthenticationService { get; }
        ITeamService TeamService { get; }
        void RegisterAuthentication(IAuthenticationService authenticationService);
    }
}
