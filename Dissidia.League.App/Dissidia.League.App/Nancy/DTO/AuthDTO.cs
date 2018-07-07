namespace Dissidia.League.App.Nancy.DTO
{
    public class AuthDTO
    {

        public string Username { get; set; }
        public string Password { get; set;  }

        public AuthDTO(string username, string password)
        {
            Username = username;
            Password = password;
        }


    }
}
