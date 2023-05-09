using Ludikore.Revoicer.Model;
using System.Xml.Linq;

namespace Ludikore.Revoicer.Services
{
    public class FileRepository
    {
        public IAudioFile CreateFile(string name, string contentType)
        {
            var directoryPath = Path.Combine("/data", "Revoicer", Guid.NewGuid().ToString());
            Directory.CreateDirectory(directoryPath);
            var actualName = string.Join(string.Empty, name.Where(c => !Path.GetInvalidFileNameChars().Contains(c)));
            var actualPath = Path.Combine(directoryPath, actualName);

            return new AudioFile(name, contentType, directoryPath);
        }
    }
}