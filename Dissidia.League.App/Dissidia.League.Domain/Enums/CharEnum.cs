using Dissidia.League.Domain.Enums.Dissidia;
using Dissidia.League.Domain.Enums.Gamification;
using Dissidia.League.Domain.Tools.Enums;
using System.Linq;

namespace Dissidia.League.Domain.Enums
{
    public class CharEnum : BaseEnum<CharEnum, string>
    {
        public static CharEnum NOCTIS = new CharEnum(1, "Noctis", RolesEnum.ASSASSIN);
        public static CharEnum YSHTOLA = new CharEnum(2, "Yshtola", RolesEnum.MASKSMEN);
        public static CharEnum LIGHTING = new CharEnum(3, "Lighting", RolesEnum.ASSASSIN);
        public static CharEnum VAYNE = new CharEnum(4, "Vayne", RolesEnum.VANGUARD);
        public static CharEnum VAAN = new CharEnum(5, "Vaan", RolesEnum.SPECIALIST);
        public static CharEnum SHANTOTTO = new CharEnum(6, "Shantotto", RolesEnum.MASKSMEN);
        public static CharEnum JETCH = new CharEnum(7, "Jetch", RolesEnum.ASSASSIN);
        public static CharEnum TIDUS = new CharEnum(8, "Tidus", RolesEnum.ASSASSIN);
        public static CharEnum KUJA = new CharEnum(9, "Kuja", RolesEnum.ASSASSIN);
        public static CharEnum ZIDANE = new CharEnum(10, "Zidane", RolesEnum.ASSASSIN);
        public static CharEnum SQUALL = new CharEnum(11, "Squall", RolesEnum.ASSASSIN);
        public static CharEnum ULTIMECIA = new CharEnum(12, "Ultimecia", RolesEnum.MASKSMEN);
        public static CharEnum CLOUD = new CharEnum(13, "Cloud", RolesEnum.VANGUARD);
        public static CharEnum SEPHIROTH = new CharEnum(14, "Sephiroth", RolesEnum.VANGUARD);
        public static CharEnum KEFKA = new CharEnum(15, "Kefka", RolesEnum.MASKSMEN);
        public static CharEnum TERRA = new CharEnum(16, "Terra", RolesEnum.MASKSMEN);
        public static CharEnum LOCKE = new CharEnum(17, "Locke", RolesEnum.ASSASSIN);
        public static CharEnum EXDEATH = new CharEnum(18, "Exdeath", RolesEnum.SPECIALIST);
        public static CharEnum BARTZ = new CharEnum(19, "Bartz", RolesEnum.SPECIALIST);
        public static CharEnum GOLBEZ = new CharEnum(20, "Golbez", RolesEnum.MASKSMEN);
        public static CharEnum CECIL = new CharEnum(21, "Cecil", RolesEnum.VANGUARD);
        public static CharEnum KAIN = new CharEnum(22, "Kain", RolesEnum.ASSASSIN);
        public static CharEnum CLOUD_OF_DARKNESS = new CharEnum(23, "Cloud of Darkness", RolesEnum.VANGUARD);
        public static CharEnum ONION_KNIGHT = new CharEnum(24, "Onion Knight", RolesEnum.SPECIALIST);
        public static CharEnum EMPEROR = new CharEnum(25, "Emperor", RolesEnum.MASKSMEN);
        public static CharEnum FIRION = new CharEnum(26, "Firion", RolesEnum.VANGUARD);
        public static CharEnum GARLAND = new CharEnum(27, "Garland", RolesEnum.VANGUARD);
        public static CharEnum WARRIOR_OF_LIGHT = new CharEnum(28, "Warrior of Light", RolesEnum.VANGUARD);
        public static CharEnum ACE = new CharEnum(29, "Ace", RolesEnum.MASKSMEN);
        public static CharEnum RAMZA = new CharEnum(30, "Ramza", RolesEnum.SPECIALIST);        
        public static CharEnum UNDEFINED = new CharEnum(0, "UNDEFINED", RolesEnum.UNDEFINIED);

        public string Role { get; private set; }

        protected CharEnum(int codigo, string valor, RolesEnum role) : base(codigo, valor)
        {
            Role = role.Valor;
        }        
    }
}
