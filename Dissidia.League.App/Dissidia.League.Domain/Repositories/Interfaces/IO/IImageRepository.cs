using System.IO;
namespace Dissidia.League.Domain.Repositories.Interfaces.IO
{
    public interface IImageRepository
    {
        void SaveImage(Stream stream, string teamId);
        Stream GetImage(string teamId);
    }
}
