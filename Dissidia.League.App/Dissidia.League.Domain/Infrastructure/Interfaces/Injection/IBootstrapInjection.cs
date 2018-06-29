namespace Dissidia.League.Domain.Infrastructure.Interfaces.Injection
{
    public interface IBootstrapInjection
    {
        IInjectionService Services { get; }
        IInjectionRepository Repositories { get; }
    }
}
