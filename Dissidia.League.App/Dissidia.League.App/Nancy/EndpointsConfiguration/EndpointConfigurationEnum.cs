using Dissidia.League.Domain.Tools.Enums;

namespace Dissidia.League.App.Nancy.EndpointsConfiguration
{
    public class EndpointConfigurationEnum : BaseEnum<EndpointConfigurationEnum, string>
    {

        public static EndpointConfigurationEnum GET_ALL_MATCHES = new EndpointConfigurationEnum(1, "dissidia/matches/all");

        protected EndpointConfigurationEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
