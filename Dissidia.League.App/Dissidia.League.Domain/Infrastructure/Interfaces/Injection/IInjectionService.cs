using Dissidia.League.Domain.Services.Interfaces;
using Dissidia.League.Domain.Services.Interfaces.Authentication;
using Dissidia.League.Domain.Services.Interfaces.Dissidia;
using Dissidia.League.Domain.Services.Interfaces.Gamification;

namespace Dissidia.League.Domain.Infrastructure.Interfaces.Injection
{
    public interface IInjectionService
    {
        IMatchesService Match { get; }
        IOCRService OCR { get; }
        IPlayerPontuationService PlayerPontuation { get; }
        IAuthenticationService Authentication { get; }
        ITeamService Team { get; }
        ITeamPontuationService TeamPontuation { get; }
        void RegisterAuthentication(IAuthenticationService authentication);
    }
}
