using Dissidia.League.Domain.Entities;
using System;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Events.Matches
{
    public class OnMatchDoneArgs : EventArgs
    {
        public Match Match { get; private set; }
        public List<string> MatchInfo { get; set; }

        public OnMatchDoneArgs(Match match)
        {
            Match = match;
        }

        public delegate void OnMatchDoneEventHandler(object sender, OnMatchDoneArgs args);

    }
}
