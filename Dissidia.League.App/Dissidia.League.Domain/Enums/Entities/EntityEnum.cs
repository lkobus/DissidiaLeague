using Dissidia.League.Domain.Tools.Enums;

namespace Dissidia.League.Domain.Enums.Entities
{
    public class EntityEnum : BaseEnum<EntityEnum, string>
    {

        public static EntityEnum MATCH = new EntityEnum(1, "MATCH");
        public static EntityEnum PLAYERSRESULTS = new EntityEnum(2, "PLAYERRESULTS");

        protected EntityEnum(int codigo, string valor) : base(codigo, valor)
        {

        }
    }
}
