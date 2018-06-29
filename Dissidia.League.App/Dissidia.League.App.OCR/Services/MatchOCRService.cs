using Dissidia.League.Domain.Events.Matches;
using Dissidia.League.Domain.Infrastructure.Interfaces.Configuration;
using Dissidia.League.Domain.Services.Interfaces;
using System.Collections.Generic;
using System.IO;
using System.Management.Automation;

namespace Dissidia.League.App.OCR.Services
{
    public class MatchOCRService : IOCRService
    {
        private object _lock = new object();

        public event OnMatchDoneArgs.OnMatchDoneEventHandler OnMatchProcessed;
        private string _ocrDir;

        public MatchOCRService(IOCRConfiguration configuration)
        {
            _ocrDir = configuration.OCRDir;
        }

        public void OnMatchDone(object sender, OnMatchDoneArgs args)
        {
            var r = new List<string>();
            lock (_lock)
            {
                using (var ps = PowerShell.Create())
                {
                    var destination = Path.Combine(_ocrDir, Path.GetFileName(args.Match.ImageFilePath));
                    System.IO.File.Copy(args.Match.ImageFilePath, destination);
                    var script = System.IO.File.ReadAllText(@"C:\Users\leonardo.kobus\Desktop\lobby\processImages.ps1");
                    ps.AddScript(script);
                    var result = ps.Invoke();
                    using(var reader = new StreamReader(@"C:\Users\leonardo.kobus\Desktop\lobby\result\matches.csv"))
                    {
                        reader.ReadLine();
                        while (!reader.EndOfStream)
                        {
                            r.Add(reader.ReadLine());
                        }
                        args.MatchInfo = r;
                    }                    
                    System.IO.File.Delete(destination);
                    
                        
                }
            }
            OnMatchProcessed?.Invoke(this, args);
        }



    }
}
