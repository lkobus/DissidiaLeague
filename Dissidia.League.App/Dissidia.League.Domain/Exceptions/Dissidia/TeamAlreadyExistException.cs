using System;
namespace Dissidia.League.Domain.Exceptions.Dissidia
{
    public class TeamAlreadyExistException : Exception
    {
        public TeamAlreadyExistException() : base($"Team already exists")
        {
        }
    }
}
