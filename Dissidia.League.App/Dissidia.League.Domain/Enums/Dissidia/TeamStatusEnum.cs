using Dissidia.League.Domain.Tools.Enums;

namespace Dissidia.League.Domain.Enums.Dissidia
{
    public class TeamStatusEnum : BaseEnum<TeamStatusEnum, string>
    {

        public static TeamStatusEnum ACTIVE = new TeamStatusEnum(1, "Active");
        public static TeamStatusEnum INACTIVE = new TeamStatusEnum(2, "Inactive");

        protected TeamStatusEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
