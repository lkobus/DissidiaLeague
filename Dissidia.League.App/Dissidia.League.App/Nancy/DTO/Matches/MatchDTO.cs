using Dissidia.League.Domain.Entities;
using Dissidia.League.Domain.ValueObjects.Match;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Dissidia.League.App.Nancy.DTO.Matches
{
    public class MatchDTO
    {
        public string Id { get; private set; }
        public DateTime Date { get; private set; }
        public List<PlayerInfo> PlayersTeamWinner { get; private set; }
        public List<PlayerInfo> PlayersTeamLooser { get; private set; }
        public int Status { get; private set; }
        public string Winners { get; private set; }
        public string Loosers { get; private set; }

        public MatchDTO(Match match)
        {
            Id = match.Id.ToString();
            Date = match.Date;
            PlayersTeamWinner = match.PlayersTeamWinner;
            PlayersTeamLooser = match.PlayersTeamLooser;
            Status = match.Status;
            Winners = string.Join(",", match.PlayersTeamWinner.Select(p => p.Name));
            Loosers = string.Join(",", match.PlayersTeamLooser.Select(p => p.Name));
        }

        [JsonConstructor]
        public MatchDTO(string id, DateTime date, List<PlayerInfo> playersTeamWinner, List<PlayerInfo> playersTeamLooser,
            int? status, string winners, string loosers)
        {
            Id = id;
            Date = date;
            PlayersTeamWinner = playersTeamWinner;
            PlayersTeamLooser = playersTeamLooser;
            if(status == null)
            {
                Status = 0;
            }
            else
            {
                Status = (int)status;
            }
            
            Winners = winners;
            Loosers = loosers;
        }

    }
}
