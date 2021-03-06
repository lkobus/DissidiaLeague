﻿using Dissidia.League.Domain.Events.Matches;
using Dissidia.League.Domain.ValueObjects.Gamification.Pontuation;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Services.Interfaces.Gamification
{
    public interface ITeamPontuationService
    {
        void OnMatchResolved(object sender, OnMatchDoneArgs args);
        List<ScorePontuation> GetTeamPontuations(string teamId);
    }
}
