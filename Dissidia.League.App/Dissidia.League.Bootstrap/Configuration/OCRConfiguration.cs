using Dissidia.League.Domain.Infrastructure.Interfaces.Configuration;
namespace Dissidia.League.Bootstrap.Configuration
{
    public class OCRConfiguration : IOCRConfiguration
    {
        public string ImageFileDirectory { get; private set; }
        public string OCRDir { get; private set; }

        public OCRConfiguration(string imageFileDirectory, string ocrDir)
        {
            ImageFileDirectory = imageFileDirectory;
            OCRDir = ocrDir;
        }
        
    }
}
