using Dissidia.League.Domain.Entities.Dissidia;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.App.Nancy.DTO.Dissidia
{
    public class TeamDTO
    {        
        public string Alias { get; private set; }
        public string Id { get; private set; }
        public List<string> Members { get; private set; }
        public string FounderId { get; private set; }

        public TeamDTO(Team team)
        {
            Alias = team.Alias;
            Id = team.Id;
            Members = team.Members;
            FounderId = team.Founder;
        }

        [JsonConstructor]
        public TeamDTO(string alias, string id, List<string> members)
        {
            Alias = alias;
            Id = id;            
            Members = members;
        }


    }
}
