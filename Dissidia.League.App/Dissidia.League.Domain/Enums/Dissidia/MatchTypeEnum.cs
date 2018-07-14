using Dissidia.League.Domain.Tools.Enums;

namespace Dissidia.League.Domain.Enums.Dissidia
{
    public class MatchTypeEnum : BaseEnum<MatchTypeEnum, string>
    {

        public MatchTypeEnum SOLO = new MatchTypeEnum(1, "SOLO");
        public MatchTypeEnum TEAM = new MatchTypeEnum(2, "TEAM");

        protected MatchTypeEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
