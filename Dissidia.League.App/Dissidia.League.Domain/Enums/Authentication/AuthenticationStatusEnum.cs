using Dissidia.League.Domain.Tools.Enums;
namespace Dissidia.League.Domain.Enums.Authentication
{
    public class AuthenticationStatusEnum : BaseEnum<AuthenticationStatusEnum, string>
    {
        public AuthenticationStatusEnum AUTHENTICATED = new AuthenticationStatusEnum(1, "AUTHENTICATED");
        public AuthenticationStatusEnum NOT_AUTHENTICATED = new AuthenticationStatusEnum(2, "NOT AUTHENTICATED");

        protected AuthenticationStatusEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
