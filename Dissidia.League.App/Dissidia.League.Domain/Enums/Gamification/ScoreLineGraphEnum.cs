using Dissidia.League.Domain.Tools.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.Domain.Enums.Gamification
{
    public class ScoreLineGraphEnum : BaseEnum<ScoreLineGraphEnum, string>
    {

        public static ScoreLineGraphEnum CURRENT_WEEK = new ScoreLineGraphEnum(1, "CURRENT WEEK");
        public static ScoreLineGraphEnum LAST_TWO_WEEK = new ScoreLineGraphEnum(2, "LAST TWO WEAKS");
        public static ScoreLineGraphEnum LAST_THREE_WEEK = new ScoreLineGraphEnum(3, "LAST THREE WEAKS");
        public static ScoreLineGraphEnum LAST_THREE_MONTH = new ScoreLineGraphEnum(4, "LAST THREE MONTHS");
        public static ScoreLineGraphEnum ALL_TIME = new ScoreLineGraphEnum(5, "ALL TIME");

        protected ScoreLineGraphEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
