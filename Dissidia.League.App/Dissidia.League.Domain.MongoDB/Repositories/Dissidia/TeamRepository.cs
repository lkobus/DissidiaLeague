using Dissidia.League.Domain.Entities.Dissidia;
using Dissidia.League.Domain.Enums.Entities;
using Dissidia.League.Domain.Repositories.Interfaces.Dissidia;
using MongoDB.Driver;
using System.IO;

namespace Dissidia.League.Domain.MongoDB.Repositories.Dissidia
{
    public class TeamRepository : BaseRepository<Team>, ITeamRepository
    {
        private string _imageDir;
        private string _extension = ".png";

        public TeamRepository(IMongoDatabase db, DirectoryInfo imageDirectory) : base(EntityEnum.TEAM, db)
        {
            _imageDir = imageDirectory.FullName;
            if (!Directory.Exists(_imageDir))
            {
                Directory.CreateDirectory(_imageDir);
            }            
        }

        public Stream GetImage(string teamId)
        {
            return new MemoryStream(File.ReadAllBytes(GetImageFullPathFile(teamId)));            
        }

        public void SaveImage(Stream stream, string teamId)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                stream.CopyTo(ms);
                File.WriteAllBytes(GetImageFullPathFile(teamId), ms.ToArray());
            }
        }

        private string GetImageFullPathFile(string teamId)
        {
            return Path.Combine(_imageDir, $"{teamId}.{_extension}");
        }
    }
}
