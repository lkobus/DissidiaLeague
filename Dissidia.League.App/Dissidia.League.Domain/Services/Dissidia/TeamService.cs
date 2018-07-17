using Dissidia.League.Domain.Entities.Dissidia;
using Dissidia.League.Domain.Exceptions.Dissidia;
using Dissidia.League.Domain.Repositories.Interfaces.Authentication;
using Dissidia.League.Domain.Repositories.Interfaces.Dissidia;
using Dissidia.League.Domain.Services.Interfaces.AccessControl;
using Dissidia.League.Domain.Services.Interfaces.Dissidia;
using System;
using System.Collections.Generic;
using System.IO;

namespace Dissidia.League.Domain.Services.Dissidia
{
    public class TeamService : ITeamService
    {
        private ITeamRepository _teamRepository;
        private IInviteService _inviteService;
        private IUserRepository _userRepository;

        public TeamService(ITeamRepository teamRepository, IInviteService inviteService, IUserRepository userRepository)
        {
            _teamRepository = teamRepository;
            _inviteService = inviteService;
            _userRepository = userRepository;
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

        public void CreateTeam(string founder, string teamName, string alias)
        {
            var team = Team.Factory.NewTeam(founder, teamName, alias).Instance;
            team.Members.Add(founder);
            _teamRepository.Upsert(team);            
        }

        public void SubmitTeamImage(string teamId, Stream image)
        {
            _teamRepository.SaveImage(image, teamId);
        }

        public Stream GetImage(string teamId)
        {
            return _teamRepository.GetImage(teamId);            
        }

        public Team GetTeam(string teamId)
        {
            return _teamRepository.GetById(teamId);
        }

        public Team GetTeamFromUser(string userId)
        {
            return _teamRepository.GetTeamFromUser(userId);
        }

        public void InvitePlayer(string email, string teamId)
        {
            var subject = $"You have been invited to team {teamId} on NT League";
            var tokenUrl = _inviteService.GenerateTokenUrl(teamId);
            var bodyMessage = $"To accept the invite from {teamId} enter the link : {tokenUrl}";
            _inviteService.Invite(email, bodyMessage, subject);            
        }

        public void JoinTeam(string userId, string token, string teamId)
        {
            if (!_inviteService.BurnToken(token))
            {
                throw new Exception("Problema no token");
            }
            userId = _userRepository.GetUserByLogin(userId).Id;
            AddMembers(teamId, new List<string>() { userId });            
        }
    }
}
