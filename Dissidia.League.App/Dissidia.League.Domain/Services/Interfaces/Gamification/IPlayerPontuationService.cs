using Dissidia.League.Domain.Events.Matches;
using Dissidia.League.Domain.ValueObjects.Gamification.Pontuation;
using System;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Services.Interfaces.Gamification
{
    public interface IPlayerPontuationService
    {
        void DeleteByMatchId(string matchId);
        void OnMatchResolved(object sender, OnMatchDoneArgs args);
        List<ScorePontuation> GetPlayersPontuations();
        List<ScorePontuation> GetSoloTeamsPontuations(int view);
        List<ScorePontuation> GetSoloTeamsPontuations(int minMatches, int view);
        PositionPontuation GetPlayerPositionPontuation(string id);
        List<ScorePontuation> GetSoloBestDuosPontuation(int view);
        List<ScorePontuation> GetSoloBestDuosPontuation(int minMatches, int view);
        List<ScorePontuation> GetPlayerInfo(string userId);
        List<ScorePontuation> GetPlayerInfo(string userId, DateTime from, DateTime until);
        LineGraph GetLineGraph(string id, int period, int type);
        ScorePontuation GetPlayerPontuation(string userId);
    }
}
