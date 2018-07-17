using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.Domain.Repositories.IO
{
    public class BaseImageRepository
    {
        protected string _imageDir;
        protected string _extension = ".png";

        public BaseImageRepository(DirectoryInfo imageDirectory)
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
                var file = Path.Combine(_imageDir, $"{teamId}{_extension}");
                File.WriteAllBytes(file, ms.ToArray());
            }
        }

        private string GetImageFullPathFile(string teamId)
        {
            var file = Path.Combine(_imageDir, $"{teamId}{_extension}");
            if (File.Exists(file))
            {
                return Path.Combine(_imageDir, $"{teamId}{_extension}");
            }
            else
            {
                return Path.Combine(_imageDir, "noTeam.png");
            }
        }

    }
}
