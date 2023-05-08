using Ludikore.Revoicer.Model;

namespace Ludikore.Revoicer.Services
{
    public class FileRepository
    {
        public IAudioFile CreateFile(string name, string contentType)
        {
            return new AudioFile(name, contentType);
        }
    }
}