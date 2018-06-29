using Dissidia.League.Domain.Infrastructure.Interfaces.Configuration;
namespace Dissidia.League.Bootstrap.Configuration
{
    public class GlobalConfiguration : IGlobalConfiguration
    {
        public IDatabaseConfiguration Database { get; private set; }
        public IOCRConfiguration OCR { get; private set; }


        public GlobalConfiguration(IDatabaseConfiguration database,
            IOCRConfiguration ocr)
        {
            Database = database;
            OCR = ocr;
        }
    }
}
