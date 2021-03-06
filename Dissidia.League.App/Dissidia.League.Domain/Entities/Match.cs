﻿using Dissidia.League.Domain.Entities.Interfaces;
using Dissidia.League.Domain.Enums.Dissidia;
using Dissidia.League.Domain.Enums.Matches;
using Dissidia.League.Domain.ValueObjects.Match;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;

namespace Dissidia.League.Domain.Entities
{
    public class Match : IEntity
    {
        
        [BsonId]
        public string Id { get; private set; }        
        public string ImageFilePath { get; private set; }
        public DateTime Date { get; private set; }
        public int Type { get; private set; }
        public List<PlayerInfo> PlayersTeamWinner { get; private set; }
        public List<PlayerInfo> PlayersTeamLooser { get; private set; }
        public int Status { get; private set; }
        public string TeamA { get; private set; }
        public string TeamB { get; private set; }
        public static MatchFactory Factory => new MatchFactory();
        public bool IsMatchDateEmpty { get { return Date == DateTime.MinValue; } }

        private Match(string filePath, int type)
        {
            Type = type;
            ImageFilePath = filePath;
            PlayersTeamWinner = new List<PlayerInfo>();
            PlayersTeamLooser = new List<PlayerInfo>();            
            Date = DateTime.MinValue;
            Status = MatchStatusEnum.PENDING;            
            Id = ObjectId.GenerateNewId().ToString();
        }

        public class MatchFactory
        {
            public Match Instance { get; private set; }


            public MatchFactory FromDTO(string id, DateTime date, List<PlayerInfo> playersTeamWinner, List<PlayerInfo> playersTeamLooser,
                int? status, string winners, string loosers,string file, MatchTypeEnum type)
            {
                Instance = new Match(file, type)
                {
                    Date = date,
                    Id = id,
                    PlayersTeamLooser = playersTeamLooser,
                    PlayersTeamWinner = playersTeamWinner,
                    Status = (int)status,
                    TeamA = "SOLO Team A",
                    TeamB = "SOLO Team B"
                };
                return this;
            }

            public MatchFactory NewMatch(string filePath, MatchTypeEnum type)
            {
                if(type == MatchTypeEnum.SOLO)
                {
                    Instance = new Match(filePath, type)
                    {
                        TeamA = "SOLO Team A",
                        TeamB = "SOLO Team B"
                    };
                }
                else
                {
                    Instance = new Match(filePath, type)
                    {
                        TeamA = string.Empty,
                        TeamB = string.Empty
                    };
                }                
                return this;
            }

            public MatchFactory NewMatch(MatchTypeEnum type)
            {
                NewMatch(string.Empty, type);
                return this;
            }


            public MatchFactory WithImage(string imageFile)
            {
                Instance.ImageFilePath = imageFile;
                return this;
            }

            public MatchFactory From(Match match)
            {
                Instance = match.MemberwiseClone() as Match;
                return this;
            }

            public MatchFactory WithDate(DateTime date)
            {
                Instance.Date = date;
                return this;
            }

            public MatchFactory MarkAsConcluded()
            {
                Instance.Status = MatchStatusEnum.CONCLUDED;
                return this;
            }

            public MatchFactory MarkAsRequestToChange()
            {
                Instance.Status = MatchStatusEnum.REQUEST_CHANGE;
                return this;
            }

            public MatchFactory WithWinners(List<PlayerInfo> winners)
            {
                Instance.PlayersTeamWinner = winners;
                return this;
            }

            public MatchFactory WithLoosers(List<PlayerInfo> loosers)
            {
                Instance.PlayersTeamLooser = loosers;
                return this;
            }

        }

        
    }
}
