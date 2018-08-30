using Dissidia.League.Domain.Tools.Enums;
namespace Dissidia.League.Domain.Enums.Dissidia
{
    public class RolesEnum : BaseEnum<RolesEnum, string>
    {
        public static RolesEnum VANGUARD = new RolesEnum(-2, "Vanguard");
        public static RolesEnum ASSASSIN = new RolesEnum(-3, "Assassin");
        public static RolesEnum MASKSMEN = new RolesEnum(-4, "Marksmen");
        public static RolesEnum SPECIALIST = new RolesEnum(-5, "Specialist");
        public static RolesEnum UNDEFINIED = new RolesEnum(-6, "Undefinied");

        public RolesEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
