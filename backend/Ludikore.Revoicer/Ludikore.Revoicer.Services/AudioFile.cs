
using System.Text.Json.Serialization;
using Microsoft.VisualBasic;

namespace Ludikore.Revoicer.Model;

public class AudioFile : IAudioFile
{

    public AudioFile(string name, string contentType, string directoryPath)
    {
        ContentType = contentType;
        Name = name;
        FilePath = Path.Combine(directoryPath, name);
    }

    public string Name { get; }
    
    public string FilePath { get; }

    public string ContentType { get;  }

    public Stream Open()
    {
        return File.Create(FilePath);
    }
}