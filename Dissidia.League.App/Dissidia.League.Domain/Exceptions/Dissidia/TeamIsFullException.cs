using System;
namespace Dissidia.League.Domain.Exceptions.Dissidia
{
    public class TeamIsFullException : Exception
    {
        public TeamIsFullException() : base($"Team is already full and cannot accept more members")
        {
        }
    }
}
