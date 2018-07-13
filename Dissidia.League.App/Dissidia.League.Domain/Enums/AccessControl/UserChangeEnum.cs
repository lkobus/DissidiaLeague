using Dissidia.League.Domain.Tools.Enums;
namespace Dissidia.League.Domain.Enums.AccessControl
{
    public class UserChangeEnum : BaseEnum<UserChangeEnum, string>
    {

        public static UserChangeEnum MATCH_UPDATE = new UserChangeEnum(1, "Match Update");

        protected UserChangeEnum(int codigo, string valor) : base(codigo, valor)
        {
        }
    }
}
