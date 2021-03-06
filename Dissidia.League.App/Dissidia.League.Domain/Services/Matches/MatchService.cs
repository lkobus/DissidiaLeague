﻿using Dissidia.League.Domain.Entities;
using Dissidia.League.Domain.Enums;
using Dissidia.League.Domain.Enums.Dissidia;
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
        public event OnMatchDoneArgs.OnMatchDoneEventHandler OnMatchUploaded;
        public event OnMatchDoneArgs.OnMatchDoneEventHandler OnMatchResolved;
        private object _lockMatchUpdate = new object();


        public MatchService(string imageStorage, IMatchRepository matchRepository)
        {
            _imageStorage = imageStorage;
            _matchRepository = matchRepository;
        }

        public async Task RegisterMatchAsync(Stream stream, MatchTypeEnum type)
        {
            await RegisterMatchAsync(stream, type, DateTime.MinValue);
        }

        public async Task RegisterMatchAsync(Stream stream, MatchTypeEnum type, DateTime date)
        {
            await Task.Factory.StartNew(() =>
            {
                try
                {
                    var match = Match.Factory.NewMatch(type)
                    .WithDate(date);
                    var imageFile = SaveImageInStorage(stream, match.Instance.Id);
                    _matchRepository.Upsert(match.WithImage(imageFile).Instance);
                    var matchArgs = new OnMatchDoneArgs(match.Instance, type);
                    OnMatchUploaded?.Invoke(this, matchArgs);
                }
                catch (Exception oi)
                {
                    var i = "";
                }
                
                
            });
        }

        private string SaveImageInStorage(Stream stream, string imageId)
        {            
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
                    if(args.Match.IsMatchDateEmpty)
                    {
                        result = Factory.From(result)
                        .WithDate(
                            DateTime.ParseExact(match.Key, "yyyy:MM:dd HH:mm:ss", CultureInfo.InvariantCulture))
                        .Instance;
                    }                    
                    m.Value.ForEach(player =>
                    {
                        var values = player.Split(';');
                        int points = 0;
                        int.TryParse(values[2], out points);
                        var character = values[3];
                        var currentChar = CharEnum.ToList().FirstOrDefault(c => c.Valor.ToUpper() == character.ToUpper());
                        if(currentChar == null)
                        {
                            currentChar = CharEnum.UNDEFINED;
                        }
                        var p = new PlayerInfo(currentChar, values[1], points);
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
            OnMatchResolved?.Invoke(this, args);
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

        public void RegisterMatches(List<Stream> streams, MatchTypeEnum type)
        {
            streams.ForEach(s => RegisterMatchAsync(s, type).Wait());            
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
            lock (_lockMatchUpdate)
            {
                OnMatchResolved?.Invoke(this, new OnMatchDoneArgs(match));
            }            
        }

        public List<Match> GetAll()
        {
            return _matchRepository.GetAll();            
        }

        public Stream GetImage(string matchId)
        {
            var match = _matchRepository.GetById(matchId);
            return new MemoryStream(System.IO.File.ReadAllBytes(match.ImageFilePath));            
        }

        public Match GetMatch(string id)
        {
            return _matchRepository.GetById(id);
        }

        public void UpdateMatch(List<PlayerInfo> playersTeamWinner, List<PlayerInfo> playersTeamLooser, string userId, string matchId)
        {
            //lock (_lockMatchUpdate)
            {
                var match = _matchRepository.GetById(matchId);

                if (IsMatchConcluded(playersTeamWinner.Concat(playersTeamLooser).ToList()))
                {
                    match = Match.Factory.From(match)
                    .WithWinners(playersTeamWinner)
                    .WithLoosers(playersTeamLooser)
                    .MarkAsConcluded()
                    .Instance;
                }
                else
                {
                    match = Match.Factory.From(match)
                    .WithWinners(playersTeamWinner)
                    .WithLoosers(playersTeamLooser)
                    .Instance;
                }
                
                _matchRepository.Upsert(match);
                OnMatchResolved?.Invoke(this, new OnMatchDoneArgs(match, userId));
            }            
        }

        private bool IsMatchConcluded(List<PlayerInfo> players)
        {
            var result = false;
            if(players.FirstOrDefault(p => p.Character == CharEnum.UNDEFINED) == null &&
                players.FirstOrDefault(p => string.IsNullOrWhiteSpace(p.Name) || 
                string.IsNullOrEmpty(p.Name)) == null)
            {
                result = true;
            }
            return result;
        }

        public List<Match> GetAllPending()
        {
            return _matchRepository.GetAllPending();            
        }
    }
}

