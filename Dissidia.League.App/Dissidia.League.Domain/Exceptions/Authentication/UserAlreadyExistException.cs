using System;
namespace Dissidia.League.Domain.Exceptions.Authentication
{
    public class UserAlreadyExistException : Exception
    {
        public UserAlreadyExistException(string username) : base($"Username {username} already exists")
        {
        }
    }
}
