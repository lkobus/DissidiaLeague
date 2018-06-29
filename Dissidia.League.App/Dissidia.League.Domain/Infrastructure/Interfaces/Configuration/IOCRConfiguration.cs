namespace Dissidia.League.Domain.Infrastructure.Interfaces.Configuration
{
    public interface IOCRConfiguration
    {
        string ImageFileDirectory { get; }
        string OCRDir { get; }
    }
}
