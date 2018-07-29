using Dissidia.League.Domain.Tools.Enums;
namespace Dissidia.League.Domain.Enums.Gamification
{
    public class ScoreTypeEnum : BaseEnum<ScoreTypeEnum, string>
    {
        public static ScoreTypeEnum CHAR = new ScoreTypeEnum(1, "Char");
        public static ScoreTypeEnum ROLE = new ScoreTypeEnum(2, "Role");
        public static ScoreTypeEnum PLAYER = new ScoreTypeEnum(3, "Player");
        public static ScoreTypeEnum TEAM = new ScoreTypeEnum(5, "Team");
        public static ScoreTypeEnum UNDEFINIED = new ScoreTypeEnum(4, "Undefinied");

        private ScoreTypeEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
