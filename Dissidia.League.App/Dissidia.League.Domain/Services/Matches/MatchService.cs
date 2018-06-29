﻿using Dissidia.League.Domain.Entities;
using Dissidia.League.Domain.Enums;
using Dissidia.League.Domain.Events.Matches;
using Dissidia.League.Domain.Repositories.Interfaces;
using Dissidia.League.Domain.Services.Interfaces;
using Dissidia.League.Domain.ValueObjects.Match;
using System;   
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Dissidia.League.Domain.Entities.Match;

namespace Dissidia.League.Domain.Services.Matches
{
    public class MatchService : IMatchesService
    {
        private string _imageStorage;
        private IMatchRepository _matchRepository;
        public event OnMatchDoneArgs.OnMatchDoneEventHandler OnMatchDone;
        public event OnMatchDoneArgs.OnMatchDoneEventHandler OnMatchResolved;

        public MatchService(string imageStorage, IMatchRepository matchRepository)
        {
            _imageStorage = imageStorage;
            _matchRepository = matchRepository;
        }

        public async Task RegisterMatchAsync(Stream stream)
        {
            await Task.Factory.StartNew(() =>
            {
                var imageFile = SaveImageInStorage(stream);
                var match = Match.Factory.NewMatch(imageFile);
                _matchRepository.Upsert(match.Instance);
                var matchArgs = new OnMatchDoneArgs(match.Instance);
                OnMatchDone?.Invoke(this, matchArgs);                
            });            
        }

        private string SaveImageInStorage(Stream stream)
        {
            var imageId = Guid.NewGuid().ToString();
            var filePathOfFile =
                Path.Combine(_imageStorage, DateTime.Now.ToString("dd-MM-yyyy"));
            if (!Directory.Exists(filePathOfFile))
            {
                Directory.CreateDirectory(filePathOfFile);
            }                
            filePathOfFile = Path.Combine(filePathOfFile , imageId + ".png");
            using (var fileStream = File.Create(filePathOfFile))
            {
                stream.Seek(0, SeekOrigin.Begin);
                stream.CopyTo(fileStream);
            }
            return filePathOfFile;
        }

        public void OnMatchProcessed(object sender, OnMatchDoneArgs args)
        {
            var result = args.Match;
            
            var matches = GroupMatchesByDate(args.MatchInfo);

            matches.GroupBy(p => p.Key)
                .ToList()
                .Where(p => !string.IsNullOrEmpty(p.Key))
                .ToList()
                .ForEach(match =>
                {                    
                    var m = match.FirstOrDefault();
                    result = Factory.From(result)
                        .WithDate(
                            DateTime.ParseExact(match.Key, "yyyy:MM:dd hh:mm:ss", CultureInfo.InvariantCulture))
                        .Instance;
                    m.Value.ForEach(player =>
                    {
                        var values = player.Split(';');
                        int points = 0;
                        int.TryParse(values[2], out points);
                        
                        var p = new PlayerInfo(CharEnum.UNDEFINED, values[1], points);
                        if(values[0] == "Derrota")
                        {
                            result.PlayersTeamLooser.Add(p);
                        }
                        else
                        {
                            result.PlayersTeamWinner.Add(p);
                        }
                        
                    });
                    
                });
            _matchRepository.Upsert(result);            

        }

        public Dictionary<string, List<string>> GroupMatchesByDate(List<string> matchInfos)
        {
            var matches = new Dictionary<string, List<string>>();
            matchInfos.ForEach(p =>
            {
                var arr = p.Split(';');
                var matchId = arr[0];
                var c = arr.ToList();
                c.RemoveAt(0);
                var body = string.Join(";", c.ToArray());
                if (matches.ContainsKey(matchId))
                {
                    matches[matchId].Add(body);
                }
                else
                {
                    matches.Add(matchId, new List<string>() { body });
                }
            });
            return matches;
        }

        public void RegisterMatches(List<Stream> streams)
        {
            streams.ForEach(s => RegisterMatchAsync(s).Wait());            
        }

        public void MarkMatchAsResolved(string matchId, List<PlayerInfo> winners, 
            List<PlayerInfo> loosers)
        {
            var match = _matchRepository.GetById(matchId);
            match.PlayersTeamWinner.Clear();
            winners.ForEach(w => match.PlayersTeamWinner.Add(w));            
            match.PlayersTeamLooser.Clear();
            loosers.ForEach(l => match.PlayersTeamLooser.Add(l));            

            match = Match.Factory.From(match).MarkAsConcluded().Instance;
            _matchRepository.Upsert(match);
            OnMatchResolved?.Invoke(this, new OnMatchDoneArgs(match));
        }

        public List<Match> GetAll()
        {
            return _matchRepository.GetAll();            
        }
    }
}