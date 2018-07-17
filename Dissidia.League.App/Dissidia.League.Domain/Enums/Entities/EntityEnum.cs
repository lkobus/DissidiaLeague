using Dissidia.League.Domain.Tools.Enums;

namespace Dissidia.League.Domain.Enums.Entities
{
    public class EntityEnum : BaseEnum<EntityEnum, string>
    {

        public static EntityEnum MATCH = new EntityEnum(1, "MATCH");
        public static EntityEnum PLAYERSRESULTS = new EntityEnum(2, "PLAYERRESULTS");
        public static EntityEnum USER = new EntityEnum(3, "USER");
        public static EntityEnum USER_CHANGE = new EntityEnum(4, "USER_CHANGE");
        public static EntityEnum TEAM = new EntityEnum(5, "TEAM");
        public static EntityEnum TEAM_PONTUATION = new EntityEnum(6, "TEAM_PONTUATION");

        protected EntityEnum(int codigo, string valor) : base(codigo, valor)
        {

        }
    }
}
