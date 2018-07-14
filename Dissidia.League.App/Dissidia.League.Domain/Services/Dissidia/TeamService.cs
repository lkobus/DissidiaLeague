using Dissidia.League.Domain.Entities.Dissidia;
using Dissidia.League.Domain.Exceptions.Dissidia;
using Dissidia.League.Domain.Repositories.Interfaces.Dissidia;
using Dissidia.League.Domain.Services.Interfaces.Dissidia;
using System;
using System.Collections.Generic;
using System.IO;

namespace Dissidia.League.Domain.Services.Dissidia
{
    public class TeamService : ITeamService
    {
        private ITeamRepository _teamRepository;

        public TeamService(ITeamRepository teamRepository)
        {
            _teamRepository = teamRepository;
        }        

        public void AddMembers(string teamId, List<string> membersId)
        {
            var team = _teamRepository.GetById(teamId);
            membersId.ForEach(m =>
            {
                if(TeamCanAcceptNewMembers(team))
                {
                    team.Members.Add(m);
                }
                else
                {
                    throw new TeamIsFullException();
                }
            });
            _teamRepository.Upsert(team);            
        }
        
        private bool TeamCanAcceptNewMembers(Team team)
        {
            return team.Members.Count < 5;
        }

        public void Quit(string teamId, string memberId)
        {
            var team = _teamRepository.GetById(teamId);
            team.Members.RemoveAll(p => p == memberId);
            _teamRepository.Upsert(team);
        }

        public void CreateTeam(string founder, string teamId, string teamName)
        {
            var team = Team.Factory.NewTeam(founder, new List<string>() { teamId }, teamName).Instance;
            _teamRepository.Upsert(team);            
        }

        public void SubmitTeamImage(string teamId, Stream image)
        {
            _teamRepository.SaveImage(image, teamId);
        }

        public Stream GetTeamImage(string teamId)
        {
            return _teamRepository.GetImage(teamId);            
        }
    }
}
