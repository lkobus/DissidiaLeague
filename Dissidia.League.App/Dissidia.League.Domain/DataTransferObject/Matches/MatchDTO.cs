using Dissidia.League.Domain.Entities;
using Dissidia.League.Domain.ValueObjects.Match;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.Domain.DataTransferObject.Matches
{
    public class MatchDTO
    {

        public DateTime Date { get; private set; }
        public List<PlayerInfo> PlayersTeamWinner { get; private set; }
        public List<PlayerInfo> PlayersTeamLooser { get; private set; }
        public int Status { get; private set; }

        public MatchDTO(Match match)
        {
            Date = match.Date;
            PlayersTeamWinner = match.PlayersTeamWinner;
            PlayersTeamLooser = match.PlayersTeamLooser;
            Status = match.Status;
        }
    }
}
