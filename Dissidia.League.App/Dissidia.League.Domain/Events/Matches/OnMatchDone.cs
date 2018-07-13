using Dissidia.League.Domain.Entities;
using System;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Events.Matches
{
    public class OnMatchDoneArgs : EventArgs
    {
        public Match Match { get; private set; }
        public List<string> MatchInfo { get; set; }
        public string UserId { get; set; }
        public bool IsOCRUpdate { get { return UserId == "OCR";  } private set { } }

        public OnMatchDoneArgs(Match match)
        {
            UserId = "OCR";
            Match = match;
        }

        public OnMatchDoneArgs(Match match, string userId)
        {
            UserId = userId;
            Match = match;
        }

        public delegate void OnMatchDoneEventHandler(object sender, OnMatchDoneArgs args);
            
    }
}
