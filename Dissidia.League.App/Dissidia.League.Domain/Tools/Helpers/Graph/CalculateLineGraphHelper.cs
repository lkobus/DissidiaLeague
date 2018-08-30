using Dissidia.League.Domain.Entities.Gamification;
using Dissidia.League.Domain.Enums.Gamification;
using Dissidia.League.Domain.ValueObjects.Gamification.Pontuation;
using Dissidia.League.Domain.ValueObjects.Match;
using Dissidia.League.Domain.ValueObjects.Matche;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.Domain.Tools.Helpers.Graph
{
    public class CalculateLineGraphHelper
    {
        private static DateTime _start = new DateTime(2018, 02, 1);

        public static DateTime GetDateFromPeriod(int period)
        {
            if (period == ScoreLineGraphEnum.CURRENT_WEEK)
            {
                return DateTime.Now.AddDays(-7);
            }
            else if (period == ScoreLineGraphEnum.LAST_TWO_WEEK)
            {
                return DateTime.Now.AddDays(-14);
            }
            else if (period == ScoreLineGraphEnum.LAST_THREE_WEEK)
            {
                return DateTime.Now.AddDays(-21);
            }
            else if (period == ScoreLineGraphEnum.LAST_THREE_MONTH)
            {
                return DateTime.Now.AddMonths(-3);
            }
            else if (period == ScoreLineGraphEnum.ALL_TIME)
            {
                return _start;
            }
            else
            {
                throw new ArgumentException($"period not supported : {period}");
            }

        }

        public static List<LineGraphData> CalculateLineGraphData(Tuple<List<string>, List<IGrouping<string, MatchScoreGroup>>>
            resultGroup, string valorCharEnum, ScoreTypeEnum scoreType, Func<List<PlayerResults>, string, ScoreTypeEnum, ScorePontuation> calculate)
        {
            var result = new List<LineGraphData>();
            resultGroup.Item1.ForEach(day =>
            {
                var resultGroupDay = resultGroup.Item2.Where(p => p.Key == day).ToList();
                if (resultGroupDay.Count > 0)
                {
                    var w = 0;
                    var l = 0;
                    resultGroupDay
                        .ForEach(group =>
                        {
                            List<PlayerResults> scores = group.
                            Select(p => p.Score as PlayerResults).ToList();
                            
                            var score = calculate(scores, valorCharEnum, scoreType);
                            if (score != null)
                            {
                                w = score.Wins;
                                l = score.Losts;
                            }
                        });
                    result.Add(new LineGraphData(w, l, day));
                }
                else
                {
                    result.Add(new LineGraphData(0, 0, day));
                }
            });
            return result;
        }


        public static Tuple<List<string>, List<IGrouping<string, MatchScoreGroup>>> GroupByPeriod(int period, List<MatchScoreGroup> matches)
        {
            List<IGrouping<string, MatchScoreGroup>> groupResult = null;
            var result = new List<string>();

            if (ScoreLineGraphEnum.CURRENT_WEEK == period)
            {
                for (int i = 0; i < 7; i++)
                {
                    result.Add(DateTime.Now.AddDays(i * -1).ToLocalTime().ToString("dd/MM/yyyy"));
                }

                groupResult = matches.GroupBy(p => p.Match.Date.ToLocalTime().ToString("dd/MM/yyyy")).ToList();
            }
            else if (ScoreLineGraphEnum.LAST_TWO_WEEK == period)
            {
                for (int i = 0; i < 14; i++)
                {
                    result.Add(DateTime.Now.AddDays(i * -1).ToLocalTime().ToString("dd/MM"));
                }
                groupResult = matches.GroupBy(p => p.Match.Date.ToLocalTime().ToString("dd/MM")).ToList();
            }
            else if (ScoreLineGraphEnum.LAST_THREE_WEEK == period)
            {
                for (int i = 0; i < 21; i++)
                {
                    result.Add(DateTime.Now.AddDays(i * -1).ToLocalTime().ToString("dd/MM"));
                }
                groupResult = matches.GroupBy(p => p.Match.Date.ToLocalTime().ToString("dd/MM")).ToList();
            }
            else if (ScoreLineGraphEnum.LAST_THREE_MONTH == period)
            {
                for (int i = 0; i < (7 * 4) * 3; i += 7)
                {
                    result.Add("W" + GetWeekNumber(DateTime.Now.AddDays(i * -1).ToLocalTime()));
                }
                groupResult = matches.GroupBy(p => "W" + GetWeekNumber(p.Match.Date.ToLocalTime())).ToList();
            }
            return new Tuple<List<string>, List<IGrouping<string, MatchScoreGroup>>>(result, groupResult);
        }

        public static int GetWeekNumber(DateTime date)
        {
            CultureInfo ciCurr = CultureInfo.CurrentCulture;
            int weekNum = ciCurr.Calendar.GetWeekOfYear(date, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
            return weekNum;
        }
    }
}
