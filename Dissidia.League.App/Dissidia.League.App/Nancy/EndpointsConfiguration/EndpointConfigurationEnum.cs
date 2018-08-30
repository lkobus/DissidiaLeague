using Dissidia.League.Domain.Tools.Enums;

namespace Dissidia.League.App.Nancy.EndpointsConfiguration
{
    public class EndpointConfigurationEnum : BaseEnum<EndpointConfigurationEnum, string>
    {   

        public static EndpointConfigurationEnum GET_ALL_MATCHES = new EndpointConfigurationEnum(1, "dissidia/matches/all");
        public static EndpointConfigurationEnum LOGIN = new EndpointConfigurationEnum(2, "dissidia/login");
        public static EndpointConfigurationEnum REGISTER_USER = new EndpointConfigurationEnum(3, "dissidia/user/register");
        public static EndpointConfigurationEnum UPLOAD_MATCH = new EndpointConfigurationEnum(4, "dissidia/match/upload/{matchType}");
        public static EndpointConfigurationEnum GET_PLAYER_PONTUATION = new EndpointConfigurationEnum(5, "dissidia/player/pontuations");
        public static EndpointConfigurationEnum GET_IMAGE_MATCH = new EndpointConfigurationEnum(6, "dissidia/matches/imagem/{id}");
        public static EndpointConfigurationEnum GET_MATCH = new EndpointConfigurationEnum(7, "dissidia/matches/{id}");
        public static EndpointConfigurationEnum CHANGE_MATCH = new EndpointConfigurationEnum(8, "dissidia/matches/{id}/{userId}");
        public static EndpointConfigurationEnum GET_CHARACTERS = new EndpointConfigurationEnum(9, "dissidia/characters");
        public static EndpointConfigurationEnum CREATE_TEAM = new EndpointConfigurationEnum(10, "dissidia/team/create/{founderId}");
        public static EndpointConfigurationEnum GET_TEAM = new EndpointConfigurationEnum(11, "dissidia/team/{teamId}");
        public static EndpointConfigurationEnum GET_TEAM_USER = new EndpointConfigurationEnum(12, "dissidia/team/user/{userId}");        
        public static EndpointConfigurationEnum JOIN_TEAM = new EndpointConfigurationEnum(12, "dissidia/team/join/{token}/{userId}/{teamId}");
        public static EndpointConfigurationEnum GET_IMAGE_TEAM = new EndpointConfigurationEnum(13, "dissidia/team/image/{teamId}");
        public static EndpointConfigurationEnum GET_IMAGE_USER = new EndpointConfigurationEnum(14, "dissidia/user/image/{userId}");
        public static EndpointConfigurationEnum GET_PLAYER_PONTUATION_BY_ID = new EndpointConfigurationEnum(15, "dissidia/player/pontuations/{userId}");
        public static EndpointConfigurationEnum GET_TEAM_PONTUATIONS = new EndpointConfigurationEnum(16, "dissidia/team/pontuations/{teamId}");
        public static EndpointConfigurationEnum GET_IMAGE_USER_BY_NICK = new EndpointConfigurationEnum(17, "dissidia/user/image/nickname/{nickname}");
        public static EndpointConfigurationEnum GET_PLAYER_PONTUATION_BY_ID_AND_DATE = new EndpointConfigurationEnum(18, "dissidia/player/pontuations/{userId}/{from}/{until}");
        public static EndpointConfigurationEnum GET_PLAYER_LINE_GRAPH = new EndpointConfigurationEnum(19, "dissidia/player/graph/line/{userId}/{period}/{typ}");
        public static EndpointConfigurationEnum INVITE_PLAYER_TEAM = new EndpointConfigurationEnum(20, "dissidia/team/invite/{teamId}/{email}");
        public static EndpointConfigurationEnum GET_NICKS_BY_ID = new EndpointConfigurationEnum(21, "dissidia/user/nickname/{userId}");
        public static EndpointConfigurationEnum GET_ALL_MATCHES_PENDING = new EndpointConfigurationEnum(22, "dissidia/matches/all/pending");
        public static EndpointConfigurationEnum GET_SOLO_TEAM_PONTUATION = new EndpointConfigurationEnum(23, "dissidia/team/solo/pontuations");

        protected EndpointConfigurationEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
