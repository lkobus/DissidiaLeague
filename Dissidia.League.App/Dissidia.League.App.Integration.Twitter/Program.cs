using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Configuration;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace Dissidia.League.App.Integration.Twitter
{
    public class Program
    {
        public static void Main(string[] args)
        {
            if (args.Length > 0)
            {
                var options = new ParallelOptions();
                options.MaxDegreeOfParallelism = 3;
                Parallel.ForEach(System.IO.Directory.GetFiles("C:\\temp\\base"), options, f =>
                 {
                     using (var ms = new MemoryStream(System.IO.File.ReadAllBytes(f)))
                     {
                         var info = new FileInfo(f);
                         var date = info.LastWriteTime;
                         try
                         {
                             SendDescarga(ConfigurationManager.AppSettings["API"] + "/" + date.ToString("yyyy-MM-dd_HH-mm-ss"),
                             ms, info.Name);
                         }
                         catch (Exception)
                         {

                         }
                         System.IO.File.Delete(f);
                     }
                 });
                
                    
                        
                    
                
            }
            else
            {
                using (var browser = new ChromeDriver(@"C:\Projetos\Dissidia\tools"))
                {
                    browser.Navigate().GoToUrl("https://twitter.com/");
                    Thread.Sleep(2222);
                    var button = browser.FindElementsByTagName("a")
                        .Where(p => p.Text.ToLower() == "entrar").FirstOrDefault();
                    button.Click();
                    Thread.Sleep(3000);
                    var inputs = browser.FindElementsByTagName("input");

                    foreach (var p in inputs)
                    {
                        if (p.GetAttribute("placeholder").ToLower().Contains("celular"))
                        {
                            if (p.Location.X > 100)
                            {
                                p.Click();
                                p.SendKeys("leonardo.kobus@hbsis.com.br");
                            }

                        }
                        else if (p.GetAttribute("placeholder").ToLower().Contains("senha"))
                        {
                            if (p.Location.X > 100)
                            {
                                p.Click();
                                p.SendKeys("9056532a");
                            }
                        }

                    }
                    var enter = browser.FindElementsByTagName("button")
                        .FirstOrDefault(p => p.Text.ToLower() == "entrar");
                    enter.Click();

                    Thread.Sleep(2000);

                    while (true)
                    {
                        browser.Navigate().GoToUrl("https://twitter.com/mentions");
                        foreach (var div in browser.FindElementsByTagName("div"))
                        {
                            try
                            {
                                if (div.GetAttribute("class").ToLower().Contains("adaptivemedia-photocontainer"))
                                {
                                    var element = div.FindElements(By.TagName("img"));
                                    var imageUrl = element[0].GetAttribute("src");
                                    var urlSplited = imageUrl.Split('/');
                                    var fileName = urlSplited[urlSplited.Length - 1];

                                    var directory = @"C:\temp\dissidia\twitter";
                                    if (!Directory.Exists(directory))
                                    {
                                        Directory.CreateDirectory(directory);
                                    }

                                    var fileFullPath = Path.Combine(directory, fileName);
                                    if (!File.Exists(fileFullPath))
                                    {
                                        using (var webClient = new WebClient())
                                        {
                                            byte[] imageBytes = webClient.DownloadData(imageUrl + ":large");
                                            System.IO.File.WriteAllBytes(fileFullPath, imageBytes);

                                            var ms = new MemoryStream(imageBytes);
                                            Console.WriteLine("Sending new image!");
                                            try
                                            {
                                                SendDescarga(ConfigurationManager.AppSettings["API"], ms, "image");
                                            }
                                            catch (Exception ex)
                                            {
                                                //System.IO.File.Delete(fileFullPath);
                                            }

                                        }
                                    }
                                    else
                                    {
                                        Console.WriteLine("{0} already exist skipping.", fileName);
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                var oi = "";
                            }

                        }
                        Thread.Sleep(5000);
                    }

                    Console.ReadKey();
                }
            }
        }


        // POST api/descarga
        public static void SendDescarga(string url, Stream memStram, string filename)
        {
            MemoryStream memStream = new MemoryStream();
            byte[] part = null;
            ToggleAllowUnsafeHeaderParsing(true);
            long arquivoTamanho = memStram.Length;

            Uri uri = new Uri(url);
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(uri);
            Stream promaxStream = null;

            string boundary = "----------" + DateTime.Now.Ticks.ToString("x");
            string formdata = "Content-Disposition: form-data; name=\"image\"";
            request.ContentType = "multipart/form-data; boundary=" + boundary;
            request.Method = WebRequestMethods.Http.Post;
            request.KeepAlive = true;
            request.Credentials = CredentialCache.DefaultCredentials;
            var NL = "\r\n";
            int PACKSIZE = 8 * 1024;

            string body = "--" + boundary + NL;
            body += formdata
                    + "; filename=\""
                    + filename
                    + "\"" + NL;
            body += "Content-Type: " + request.ContentType + NL;
            //?			body += "Content-Length: " + arquivoTamanho + NL;
            body += NL;
            part = Encoding.Default.GetBytes(body);
            memStream.Write(part, 0, part.Length);

            // Recebe o arquivo enviado pelo cliente e salva na memStream.
            Stream inputStream = memStram;
            var buffer = new byte[PACKSIZE];
            int length;
            while ((length = inputStream.Read(buffer, 0, buffer.Length)) > 0)
            {
                memStream.Write(buffer, 0, length);
            }

            body = NL + "--" + boundary + NL;
            body += "Content-Disposition: form-data; name=\"upload\"" + NL + NL;
            body += "Enviar" + NL;
            body += "--" + boundary + "--";

            part = Encoding.Default.GetBytes(body);
            memStream.Write(part, 0, part.Length);

            part = memStream.ToArray();
            request.ContentLength = part.Length;

            memStream.SetLength(0);
            // Envia para o Promax.
            try
            {
                promaxStream = request.GetRequestStream();
                promaxStream.Write(part, 0, part.Length);
                promaxStream.Flush();
                promaxStream.Close();
            }
            catch (Exception) { }
            /**/
            WebResponse response = null;
            int totalLen = 0;

            memStream.Position = 0;
            // Lê a resposta do Promax e retorna para o cliente.
            try
            {
                response = (HttpWebResponse)request.GetResponse();
            } catch(Exception ex)
            {
                var oi = "";
            }
            
            
            HttpWebResponse httpResponse = (HttpWebResponse)response;            
            //HttpContext.Current.Response.StatusCode = (int)httpResponse.StatusCode;            
            promaxStream = httpResponse.GetResponseStream();
            totalLen = 0;
            string resp = "";
            while ((length = promaxStream.Read(buffer, 0, buffer.Length)) > 0)
            {
                memStream.Write(buffer, totalLen, length);
                totalLen += length;
                try
                {
                    resp += System.Text.Encoding.Default.GetString(buffer, 0, length);

                }
                catch (Exception) { }
            }
            if (!resp.Contains(".zip"))
            {
                throw new Exception("Não foi possivel enviar o arquivo");
            }
        }

        public static bool ToggleAllowUnsafeHeaderParsing(bool enable)
        {
            //Get the assembly that contains the internal class
            Assembly assembly = Assembly.GetAssembly(typeof(SettingsSection));
            if (assembly != null)
            {
                //Use the assembly in order to get the internal type for the internal class
                Type settingsSectionType = assembly.GetType("System.Net.Configuration.SettingsSectionInternal");
                if (settingsSectionType != null)
                {
                    //Use the internal static property to get an instance of the internal settings class.
                    //If the static instance isn't created already invoking the property will create it for us.
                    object anInstance = settingsSectionType.InvokeMember("Section",
                    BindingFlags.Static | BindingFlags.GetProperty | BindingFlags.NonPublic, null, null, new object[] { });
                    if (anInstance != null)
                    {
                        //Locate the private bool field that tells the framework if unsafe header parsing is allowed
                        FieldInfo aUseUnsafeHeaderParsing = settingsSectionType.GetField("useUnsafeHeaderParsing", BindingFlags.NonPublic | BindingFlags.Instance);
                        if (aUseUnsafeHeaderParsing != null)
                        {
                            aUseUnsafeHeaderParsing.SetValue(anInstance, enable);
                            return true;
                        }

                    }
                }
            }
            return false;
        }


    }
}
