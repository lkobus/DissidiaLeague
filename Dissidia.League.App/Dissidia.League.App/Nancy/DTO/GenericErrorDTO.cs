using System;

namespace Dissidia.League.App.Nancy.DTO
{
    public class GenericErrorDTO
    {
        public string Error { get; private set; }

        public GenericErrorDTO(Exception ex)
        {
            Error = ex.Message;
        }

    }
}
