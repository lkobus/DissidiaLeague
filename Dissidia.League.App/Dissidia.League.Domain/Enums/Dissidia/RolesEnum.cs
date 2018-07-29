using Dissidia.League.Domain.Tools.Enums;
namespace Dissidia.League.Domain.Enums.Dissidia
{
    public class RolesEnum : BaseEnum<RolesEnum, string>
    {
        public static RolesEnum VANGUARD = new RolesEnum(1, "Vanguard");
        public static RolesEnum ASSASSIN = new RolesEnum(2, "Assassin");
        public static RolesEnum MASKSMEN = new RolesEnum(3, "Marksmen");
        public static RolesEnum SPECIALIST = new RolesEnum(4, "Specialist");
        public static RolesEnum UNDEFINIED = new RolesEnum(5, "Undefinied");

        public RolesEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
