namespace Dissidia.League.App.Nancy.DTO
{
    public class UserRegisterDTO
    {

        public string Username { get; private set; }
        public string Password { get; private set; }
        public string Email { get; private set; }

        public UserRegisterDTO(string username, string password, string email)
        {
            Username = username;
            Password = password;
            Email = email;
        }

    }
}
