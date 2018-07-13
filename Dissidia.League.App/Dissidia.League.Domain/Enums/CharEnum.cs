using Dissidia.League.Domain.Tools.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.Domain.Enums
{
    public class CharEnum : BaseEnum<CharEnum, string>
    {
        public static CharEnum NOCTIS = new CharEnum(1, "Noctis");
        public static CharEnum YSHTOLA = new CharEnum(2, "Yshtola");
        public static CharEnum LIGHTING = new CharEnum(3, "Lighting");
        public static CharEnum VAYNE = new CharEnum(4, "Vayne");
        public static CharEnum VAAN = new CharEnum(5, "Vaan");
        public static CharEnum SHANTOTTO = new CharEnum(6, "Shantotto");
        public static CharEnum JETCH = new CharEnum(7, "Jetch");
        public static CharEnum TIDUS = new CharEnum(8, "Tidus");
        public static CharEnum KUJA = new CharEnum(9, "Kuja");
        public static CharEnum ZIDANE = new CharEnum(10, "Zidane");
        public static CharEnum SQUALL = new CharEnum(11, "Squall");
        public static CharEnum ULTIMECIA = new CharEnum(12, "Ultimecia");
        public static CharEnum CLOUD = new CharEnum(13, "Cloud");
        public static CharEnum SEPHIROTH = new CharEnum(14, "Sephiroth");
        public static CharEnum KEFKA = new CharEnum(15, "Kefka");
        public static CharEnum TERRA = new CharEnum(16, "Terra");
        public static CharEnum LOCKE = new CharEnum(17, "Locke");
        public static CharEnum EXDEATH = new CharEnum(18, "Exdeath");
        public static CharEnum BARTZ = new CharEnum(19, "Bartz");
        public static CharEnum GOLBEZ = new CharEnum(20, "Golbez");
        public static CharEnum CECIL = new CharEnum(21, "Cecil");
        public static CharEnum KAIN = new CharEnum(22, "Kain");
        public static CharEnum CLOUD_OF_DARKNESS = new CharEnum(23, "Cloud of Darkness");
        public static CharEnum ONION_KNIGHT = new CharEnum(24, "Onion Knight");
        public static CharEnum EMPEROR = new CharEnum(25, "Emperor");
        public static CharEnum FIRION = new CharEnum(26, "Firion");
        public static CharEnum GARLAND = new CharEnum(27, "Garland");
        public static CharEnum WARRIOR_OF_LIGHT = new CharEnum(28, "Warrior of Light");
        public static CharEnum ACE = new CharEnum(29, "Ace");
        public static CharEnum RAMZA = new CharEnum(30, "Ramza");        
        public static CharEnum UNDEFINED = new CharEnum(0, "UNDEFINED");

        protected CharEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
