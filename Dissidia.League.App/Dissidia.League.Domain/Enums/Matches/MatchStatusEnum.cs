using Dissidia.League.Domain.Tools.Enums;

namespace Dissidia.League.Domain.Enums.Matches
{
    public class MatchStatusEnum : BaseEnum<MatchStatusEnum, string>
    {

        public static MatchStatusEnum PENDING = new MatchStatusEnum(1, "PENDING");
        public static MatchStatusEnum CONCLUDED = new MatchStatusEnum(2, "CONCLUDED");
        public static MatchStatusEnum REQUEST_CHANGE = new MatchStatusEnum(3, "REQUEST CHANGE");

        protected MatchStatusEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
