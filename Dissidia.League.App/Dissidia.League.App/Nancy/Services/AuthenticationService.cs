using Dissidia.League.Domain.Entities.Gamification;
using Dissidia.League.Domain.Exceptions.Authentication;
using Dissidia.League.Domain.Repositories.Interfaces.Authentication;
using Dissidia.League.Domain.Services.Interfaces.Authentication;
using Dissidia.League.Domain.ValueObjects.Authentication;
using System;
using System.IO;
using static Dissidia.League.Domain.Entities.Gamification.User;

namespace Dissidia.League.App.Nancy.Services
{
    public class AuthenticationService : IAuthenticationService
    {
        private IUserRepository _userRepository;

        public AuthenticationService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public bool AuthUser(string username, string password)
        {
            var result = false;
            var user = _userRepository.GetUserByLogin(username);
            if(user != null)
            {
                result = user.Credentials.Password == password;
            }
            return result;
        }

        public Stream GetImage(string userId)
        {
            return _userRepository.GetImage(userId);   
        }

        public Stream GetImageFromNick(string nickName)
        {
            return _userRepository.GetImage(_userRepository.GetUserByLogin(nickName).Id);            
        }

        public UserSession GetLoggedUser()
        {            
            throw new NotImplementedException();
        }

        public string GetUserIdByUsername(string username)
        {
            var user = _userRepository.GetUserByLogin(username);
            return user.Id;            
        }

        public void RegisterUser(string username, string password, string email)
        {
            var user = _userRepository.GetUserByLogin(username);
            if(user == null)
            {
                var userFactory = User.Factory.CreateUser(new Credentials(username, password), email);
                _userRepository.Upsert(userFactory.Instance);
            } else
            {
                throw new UserAlreadyExistException(username);
            }            
        }

        public void SubmitUserImage(string userId, Stream image)
        {
            _userRepository.SaveImage(image, userId);
        }
    }
}
