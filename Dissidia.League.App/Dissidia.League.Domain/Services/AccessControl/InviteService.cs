using Dissidia.League.Domain.Infrastructure.Interfaces.Configuration;
using Dissidia.League.Domain.Services.Interfaces.AccessControl;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;

namespace Dissidia.League.Domain.Services.AccessControl
{
    public class InviteService : IInviteService
    {
        private object _lock = new object();
        private string _apiUrl;
        private string _tokenDir;

        public InviteService(IGlobalConfiguration globalConfig)
        {
            _apiUrl = globalConfig.APIUrl;
            _tokenDir = globalConfig.TokenDir;
            if (!Directory.Exists(_tokenDir))
            {
                Directory.CreateDirectory(_tokenDir);
            }
        }

        public string GenerateTokenUrl(string teamId)
        {
            var token = Guid.NewGuid().ToString().Replace("-", string.Empty);            
            File.Create(Path.Combine(_tokenDir, token));
            return $"{_apiUrl}/invite/invite.html?token={token}&teamId={teamId}";
        }

        public void Invite(string destination, string bodyMessage, string subject)
        {
            lock (_lock)
            {
                MailMessage mail = new MailMessage("dissidia.noreply@gmail.com", destination);
                SmtpClient client = new SmtpClient();
                client.Port = 587;
                client.EnableSsl = true;
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.UseDefaultCredentials = false;
                client.Host = "smtp.gmail.com";
                client.Credentials = new NetworkCredential("dissidia.noreply", "9056532a");
                mail.Subject = subject;
                mail.Body = bodyMessage;
                client.Send(mail);                
            }
            
        }

        public bool BurnToken(string token)
        {
            var file = Path.Combine(_tokenDir, token);
            var result = File.Exists(file);
            if (result)
            {
                File.Delete(file);
            }
            return result;            
        }
    }
}
