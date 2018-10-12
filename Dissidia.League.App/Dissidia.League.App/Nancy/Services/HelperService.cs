using Dissidia.League.Domain.Entities;
using Dissidia.League.Domain.Infrastructure.Interfaces.Injection;
using Dissidia.League.Domain.ValueObjects.Match;
using Nancy.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Dissidia.League.Domain.Entities.Match;

namespace Dissidia.League.App.Nancy.Services
{
    public class HelperService
    {
        private static bool _passou = false;
        public static void RepairNames(IBootstrapInjection injection)
        {

            var allMAtches = injection.Repositories.Match.GetAll();

            var allNames = allMAtches.Select(p => p.PlayersTeamWinner.Select(n => n.Name).Concat(p.PlayersTeamLooser.Select(n => n.Name)));
            IEnumerable<string> result = new List<string>();
            foreach(var teamNAme in allNames)
            {
                result = result.Concat(teamNAme);
            }
            var distinctNames = result.DistinctBy(p => p);
            var playerDicts = GetPlayersDict();


            var newMatches = new List<Match>();
            allMAtches.ForEach(m =>
            {
                _passou = false;
                var winners = new List<PlayerInfo>();
                var loosers = new List<PlayerInfo>();
                m.PlayersTeamWinner.ForEach(p => winners.Add(CorrectPlayerInfo(playerDicts, p)));
                m.PlayersTeamLooser.ForEach(p => loosers.Add(CorrectPlayerInfo(playerDicts, p)));
                if (_passou)
                {
                    newMatches.Add(Match.Factory.From(m)
                    .WithWinners(winners)
                    .WithLoosers(loosers)
                    .Instance);
                }
                
            });


            newMatches.ForEach(m =>
            {
                injection.Repositories.Match.Upsert(m);
            });
            var oi = "";
        }

        public static PlayerInfo CorrectPlayerInfo(IDictionary<string, List<string>> correct, PlayerInfo currentPlayer)
        {
            var correctName = correct.Keys.FirstOrDefault(p => correct[p].FirstOrDefault(c => c == currentPlayer.Name) != null);            
            if(correctName == null)
            {
                
                return currentPlayer;
            }
            _passou = true;
            return new PlayerInfo(currentPlayer.Character, correctName, currentPlayer.Points);
        }

        public static IDictionary<string, List<string>> GetPlayersDict()
        {
            var result = new Dictionary<string, List<string>>();

            var Ikobus = new List<string>() { "leonardo-kobus", "leanardo-kobus", "A leonardo-kobus", "4 leonardo-kobus" , "J leonardo-kobus", "i leonardo-kobus", "\" leonardo-kobus", "j leonardo-kobus", "¥ leonardo-kobus", "4 leanardo-kobus", "P leonardo-kobus", "/ leanardo-kobus", "Ikobus | UZ", "-~ Ikobus | U7", "U7 | Ikobus", "UZ | Ikobus", "Ikobus", "F leonardo-kobus", "FA leanardo-kobus", "Pl leonardo-kobus", "\"A leonardo-kobus", "., leonardo-kobus", "y leonardo-kobus", "*A leonardo-kobus" , "FA leonardo-kobus", "Ikobus-san", "Edward Elric", "r Ikobus", "( leonardo-kobus", "4 Ikobus"};
            result.Add("Ikobus", Ikobus);
            var cesaradf = new List<string>() { "Cesaradt", "Cesardf" };
            result.Add("Cesaradf", cesaradf);
            var muguiwaraZoro = new List<string>() { "MusuiwaraZoro77", "MuguiwaraZoro7/7", "MuguiwaraZoro7/ 7", "MusuiwaraZoro?7", "MuguiwaraZoro77" };
            result.Add("MuguiwaraZoro", muguiwaraZoro);
            var hayato = new List<string>() { "Penetra%ao HARD", "HayatoS89", "Hayato589", "Havato589" , "Hayato589 ___"};
            result.Add("Hayato", hayato);
            var pedroBrasil = new List<string>() { "pedrobrasileiru", "» - pedrobrasileitu", "--- - pedrobrasileiru", "--- - pedrobrasileiru", "pedrobrastleiru", "Ofebas Petunio ~~" , "Ofebas Petunio", "pedrobrasileiru ~", "N pedrobrasileiru", "Pedro BRASIL _ ~"};
            result.Add("Pedro BRASIL", pedroBrasil);
            var incognita = new List<string>() { "Incognitay", "Incosnitay", "Incoenitay", "--- -_- Incognitay" , "UZ | Incognita", "U7 | Incognita", "Incognitay ___", "Cebola-san", "Fa Incognitay"};
            result.Add("Incognita", incognita);
            var barreto = new List<string>() { "Barreto- 1", "- N Barreto-1", "Barreto-1", "BHarreto- |", "Batreto- 1" };
            result.Add("Barreto", barreto);
            var longa = new List<string>() { "longaS2", "longa52", "lonea52" };
            result.Add("longa", longa);
            var sardellifilipe = new List<string>() { "sardellifiline", "sardellifiline" };
            result.Add("sardellifilipe", sardellifilipe);
            var ethanhuntbrazil = new List<string>() { "ethanhuntbrazil --" };//Ethan Hunt BR
            result.Add("Ethan Hunt BR", ethanhuntbrazil);
            var enrico = new List<string>() { "aS - enficocostantini" , "enricocostantini"};
            result.Add("enrico", enrico);
            var coppola = new List<string>() { "\"The Tempest\"", "vCoppola", "The Tempest", "Coppola-san", "Roy Mustang" };
            result.Add("Coppola", coppola);
            var nanime = new List<string>() { "Nanime:" };
            result.Add("Nanime", nanime);
            var joaoggpaim = new List<string>() { "josoggpaim", "joacegpaim" };
            result.Add("joaoggpaim", joaoggpaim);
            var sancelot = new List<string>() { "Sancelot BR", "Sancelot_BR", "Sancelot_BR _ ---" };
            result.Add("Sancelot", sancelot);
            var xiahwase = new List<string>() { "xishwase",  };
            result.Add("xiahwase", xiahwase);
            var kotsume = new List<string>() { "Diiego_ sword", "Diiego_sword", "Diiego sword" };
            result.Add("Kotsume", kotsume);
            var Zack_Schneider = new List<string>() { "Zack Schneider", "Zack_5chneider", "Zack_Schneider r" };
            result.Add("Zack_Schneider", Zack_Schneider);
            var evandro = new List<string>() { "evandrocarlos20", "evandrocarlos20 _ -~", "p evandrocarlos20", "# evandrocarlos20", "+ evandrocarlos20", "Soldier | UZ", "U7 Z-STAR", "U7 Z-5TAR", "f U7 Z-5TAR", "U7 Buster Blade", "A evandrocarlos20", "4 evandrocarlos20", "evandrocarlos 20", "evandrocarlos20 ---", "7 evandrocarlos20"};
            result.Add("Evandro", evandro);
            var foxmcjp = new List<string>() { "Foxmcip", "Foxmejp", "Foxmeip" };
            result.Add("Foxmcjp", foxmcjp);
            var rafaelKiller = new List<string>() { "RaFseL_K1llerS7", "RaFaeL_K1 ller57", "RaFaeL Killer57", "RaFaeL K1ller57", "RaFaeL_K1llerS7", "RaFael K1llerS7", "RakaeL_K", "RaFaeL_K1ler57", "RaFseL_K1ller57", "RakaeL_K I llers/" , "RaFaeL K1llerS7"};
            result.Add("RaFaeL_K1ller57", rafaelKiller);
            var strife = new List<string>() { "FFxxStrife", "FDoStrife", "FPxStrife", "FhoStrife __ ~", "FPoStrife", "FPxxStrife", "___ FPoStrife", "FExxStrife", "FhoStrife", "FFxStrife", "FDobtrite", "FPhoStrife", "FPoxStrife", "FhodStrife", "EHxxbtite" , "U7 | Strife", "FPuxStrife", "EHxxbtnte", "FDaStrife", "Strife-san", "FFPxStrife"};
            result.Add("Strife", strife);
            var terraBranford = new List<string>() { "TerraBranford?" };
            result.Add("TerraBranford", terraBranford);
            var lockJammer = new List<string>() { "LockJammer ." };
            result.Add("LockJammer", lockJammer);
            var speedWagon = new List<string>() { "Speedwagon - /" };
            result.Add("Speedwagon", speedWagon);
            var kyons = new List<string>() { "kvons666", "kyons666" };
            result.Add("Kyons", kyons);
            var ronin_errante = new List<string>() { "Ronin_errante._", "Ronin _errante_", "Ronin errante" };
            result.Add("ronin_errante_", ronin_errante);
            var will_br = new List<string>() { "Willanver_BRA", "Willanyer_BRA" };
            result.Add("will", will_br);
            var leehZack = new List<string>() { "LeehZackQ1", "LeehZackQ1 - --","LeehZackO1", "LeehZack01" };
            result.Add("LeehZack", leehZack);
            var iSagga = new List<string>() { "iSagga/77", "ibagea/77", "ibageaZ77", "iSagea/77", "ibagea777", "iSagea777" };
            result.Add("iSagga", iSagga);
            return result;

        }

    }
}
