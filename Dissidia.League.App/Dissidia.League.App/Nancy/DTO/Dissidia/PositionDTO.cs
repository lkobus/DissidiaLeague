using Dissidia.League.Domain.ValueObjects.Gamification.Pontuation;

namespace Dissidia.League.App.Nancy.DTO.Dissidia
{
    public class PositionDTO
    {
        public int First { get; private set; }
        public int Second { get; private set; }
        public int Third { get; private set; }
        public int Fourth { get; private set; }
        public int Fifth { get; private set; }
        public int Sixth { get; private set; }

        public PositionDTO(PositionPontuation position)
        {
            First = position.First;
            Second = position.Second;
            Third = position.Third;
            Fourth = position.Fourth;
            Fifth = position.Fifth;
            Sixth = position.Sixth;
        }

    }
}
