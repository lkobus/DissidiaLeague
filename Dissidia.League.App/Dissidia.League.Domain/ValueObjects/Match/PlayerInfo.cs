using Dissidia.League.Domain.Enums;
using Newtonsoft.Json;

namespace Dissidia.League.Domain.ValueObjects.Match
{
    public class PlayerInfo
    {

        public string Name { get; private set; }
        public int Character { get; private set; }
        public int Points { get; private set; }

        public PlayerInfo(CharEnum character, string name, int points)
        {
            Name = name;
            Character = character;
            Points = points;
        }

        [JsonConstructor]
        public PlayerInfo(int character, string name, int points)
        {
            Name = name;
            Character = character;
            Points = points;
        }

    }
}
