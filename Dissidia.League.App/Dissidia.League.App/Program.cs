using Nancy.Hosting.Self;
using System;

namespace Dissidia.League.App
{
    public class Program
    {
        public static void Main(string[] args)
        {
            try
            {
                using (var host = new NancyHost(new Uri("http://localhost:8999")))
                {
                    host.Start();
                    Console.Write("Press to quit...");
                    Console.ReadKey();
                }
            } catch(Exception ex)
            {
                var oi = "";
            }
            
        }
    }
}
