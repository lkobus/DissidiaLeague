using System.Linq;
using System.Collections.Generic;
using Dissidia.League.Domain.ValueObjects.Match;
using System;
using System.Globalization;

namespace Dissidia.League.Domain.ValueObjects.Gamification.Pontuation
{
    public class LineGraph
    {
        public List<string> Labels { get; private set; }
        public List<int> Wins { get; private set; }
        public List<int> Losts { get; private set; }

        public LineGraph(List<LineGraphData> data)
        {            
            data = data.OrderBy(p => {
                if(p.Label.Length == 10)
                {
                    return DateTime.ParseExact(p.Label, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                } else if (p.Label.StartsWith("W"))
                {
                    return new DateTime(Convert.ToInt32(p.Label.Split('W')[1]));
                } else
                {
                    return DateTime.ParseExact(p.Label, "dd/MM", CultureInfo.InvariantCulture);
                }                    
            })
            .ToList();
            Labels = data.Select(p => p.Label).ToList();
            Wins = data.Select(p => p.Win).ToList();
            Losts = data.Select(p => p.Lost).ToList();

            
        }
    }
}
