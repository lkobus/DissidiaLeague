namespace Dissidia.League.Domain.ValueObjects.Gamification.Pontuation
{
    public class PositionPontuation
    {
        public int First { get; private set; }        
        public int Second { get; private set; }
        public int Third { get; private set; }
        public int Fourth { get; private set; }
        public int Fifth { get; private set; }
        public int Sixth { get; private set; }

        public PositionPontuation(int first, int second, int third, int fourth, int fifth, int sixth)
        {
            First = first;
            Second = second;
            Third = third;
            Fourth = fourth;
            Fifth = fifth;
            Sixth = sixth;
        }

    }
}
