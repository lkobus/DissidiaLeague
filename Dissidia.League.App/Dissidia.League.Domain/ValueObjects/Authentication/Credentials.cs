namespace Dissidia.League.Domain.ValueObjects.Authentication
{
    public class Credentials
    {

        public string Username { get; private set; }
        public string Password { get; private set; }

        public Credentials(string username, string password)
        {
            Username = username;
            Password = password;
        }
    }
}
