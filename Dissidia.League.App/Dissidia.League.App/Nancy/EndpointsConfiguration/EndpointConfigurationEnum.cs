using Dissidia.League.Domain.Tools.Enums;

namespace Dissidia.League.App.Nancy.EndpointsConfiguration
{
    public class EndpointConfigurationEnum : BaseEnum<EndpointConfigurationEnum, string>
    {

        public static EndpointConfigurationEnum GET_ALL_MATCHES = new EndpointConfigurationEnum(1, "dissidia/matches/all");
        public static EndpointConfigurationEnum LOGIN = new EndpointConfigurationEnum(2, "dissidia/login");
        public static EndpointConfigurationEnum REGISTER_USER = new EndpointConfigurationEnum(3, "dissidia/user/register");
        public static EndpointConfigurationEnum UPLOAD_MATCH = new EndpointConfigurationEnum(4, "dissidia/match/upload");
        public static EndpointConfigurationEnum GET_PLAYER_PONTUATION = new EndpointConfigurationEnum(5, "dissidia/player/pontuations");

        protected EndpointConfigurationEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
