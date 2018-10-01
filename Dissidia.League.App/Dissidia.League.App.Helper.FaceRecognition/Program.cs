using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dissidia.League.App.Helper.FaceRecognition
{
    public class Program
    {

        public static Dictionary<string, string[]> _trainData = new Dictionary<string, string[]>();        

        public static void Main(string[] args)
        {
            var res = new List<string>();
            var res2 = new List<dynamic>();
            var input = args[0];
            var trainDir = args[1];
            var outputResult = args[2];
            LoadTrainDir(trainDir);


            Parallel.ForEach(Directory.GetFiles(input), currentFaceFile =>
            {
                var currentFace = System.IO.File.ReadAllLines(currentFaceFile);
                var options = new ParallelOptions();
                options.MaxDegreeOfParallelism = 10;
                Parallel.ForEach(_trainData.Keys, options, t =>
                {
                    var howManyMatches = 0;
                    var howManyDismatches = 0;
                    
                    for(var i = 0; i < currentFace.Length; i++)
                    {
                        if(IsPixelMatch(currentFace[i], _trainData[t][i]))
                        {
                            howManyMatches++;
                        } else
                        {
                            howManyDismatches++;
                        }
                    }
                    var referencia = new FileInfo(currentFaceFile).Name;                    
                    lock (res)
                    {
                        res.Add($"input;{referencia};{t};{howManyMatches};{howManyDismatches}");
                        res2.Add(new
                        {
                            Referencia = referencia,
                            Character = t.Split('_')[0],
                            Probability = (howManyMatches * 100) / currentFace.Length
                        });
                    }
                });
            });

            var ordenered = res2.Where(p => p.Probability > 50).OrderByDescending(p => p.Probability).ToList();


            var oi = "";
        }

        private static bool IsPixelMatch(string line1, string line2)
        {
            var line1RGB = line1.Split('-');
            var line2RGB = line2.Split('-');
            var result = true;
            try
            {                
                for (var i = 0; i < line1RGB.Length; i++){
                    var diff = GetPercentualDiff(Convert.ToInt32(line1RGB[i]), Convert.ToInt32(line2RGB[i]));           
                    if (diff > 2){
				        result = false;
                        break;  
                    }
                }
            }
            catch
            { }
            return result;
        }      
        
        private static double GetPercentualDiff(int value, int value2)
        {
            var maxValue = 255;
            var diff = System.Math.Abs(value - value2);
            return ((diff * 100) / maxValue);
        }

        public static void LoadTrainDir(string trainDir)
        {
            
            Parallel.ForEach(Directory.GetDirectories(trainDir), d =>
            {
                var dirInfo = new DirectoryInfo(d);
                Directory.GetFiles(d).ToList()
                .ForEach(f =>
                {
                    var lines = System.IO.File.ReadAllLines(f);
                    lock (_trainData)
                    {
                        _trainData.Add($"{dirInfo.Name}-{new FileInfo(f).Name}", lines);                        
                    }
                });
                
            });
                
            
        }
    }
}
