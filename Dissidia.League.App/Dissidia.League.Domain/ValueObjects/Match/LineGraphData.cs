using System;

namespace Dissidia.League.Domain.ValueObjects.Match
{
    public class LineGraphData
    {        
        public int Win { get; private set; }
        public int Lost { get; private set; }
        public string Label { get; private set; }

        public LineGraphData(int win, int lost, string label)
        {            
            Win = win;
            Lost = lost;
            Label = label;
        }

    }
}
