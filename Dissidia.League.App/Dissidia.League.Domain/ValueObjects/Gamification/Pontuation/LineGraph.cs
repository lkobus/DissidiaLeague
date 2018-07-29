using System.Collections.Generic;
namespace Dissidia.League.Domain.ValueObjects.Gamification.Pontuation
{
    public class LineGraph
    {

        public List<string> Labels { get; private set; }
        public List<int> Wins { get; private set; }
        public List<int> Losts { get; private set; }


        public LineGraph(List<string> labels, List<int> wins, List<int> losts)
        {
            Labels = labels;
            Wins = wins;
            Losts = losts;
        }
    }
}
