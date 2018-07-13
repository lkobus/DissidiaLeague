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
        public static EndpointConfigurationEnum GET_IMAGE_MATCH = new EndpointConfigurationEnum(6, "dissidia/matches/imagem/{id}");
        public static EndpointConfigurationEnum GET_MATCH = new EndpointConfigurationEnum(7, "dissidia/matches/{id}");
        public static EndpointConfigurationEnum CHANGE_MATCH = new EndpointConfigurationEnum(8, "dissidia/matches/{id}/{userId}");
        public static EndpointConfigurationEnum GET_CHARACTERS = new EndpointConfigurationEnum(9, "dissidia/characters");

        protected EndpointConfigurationEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
