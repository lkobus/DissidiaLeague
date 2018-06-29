namespace Dissidia.League.Domain.Tools.Enums
{
    public interface IBaseEnum<T>
    {

        int Codigo { get; }
        T Valor { get; }

    }
}
