namespace Dissidia.League.Domain.Infrastructure.Interfaces.Configuration
{
    public interface IGlobalConfiguration
    {
        IDatabaseConfiguration Database { get; }
        IOCRConfiguration OCR { get; }
        string APIUrl { get; }
        string TokenDir { get; }

    }
}
