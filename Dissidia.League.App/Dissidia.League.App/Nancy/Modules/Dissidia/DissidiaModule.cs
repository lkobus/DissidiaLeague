using Dissidia.League.App.Nancy.EndpointsConfiguration;
using Dissidia.League.Domain.Enums;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Nancy;
namespace Dissidia.League.App.Nancy.Modules.Dissidia
{
    public class DissidiaModule : NancyModule
    {
        public DissidiaModule(IBootstrapInjection injection)
        {

            Get[EndpointConfigurationEnum.GET_CHARACTERS] = p =>
            {
                return Response.AsJson(CharEnum.ToList());
            };

            Get["email"] = p =>
            {
                injection.Services.Team.InvitePlayer("leonardo.kobus@gmail.com", "teste");
                return "";
            };
        }
    }
}
