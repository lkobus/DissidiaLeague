using Dissidia.League.Domain.Tools.Enums;

namespace Dissidia.League.Domain.Enums.Dissidia
{
    public class ViewEnum : BaseEnum<ViewEnum, string>
    {

        public static ViewEnum CHAR = new ViewEnum(1, "CHAR");
        public static ViewEnum ROLES = new ViewEnum(2, "ROLES");
        public static ViewEnum PLAYER = new ViewEnum(3, "PLAYERS");

        protected ViewEnum(int codigo, string valor) : base(codigo, valor)
        {

        }
    }
}
