
namespace Ludikore.Revoicer.Model;

public class AudioFile : IAudioFile, IDisposable
{
    public AudioFile(string name, string contentType)
    {
        ContentType = contentType;
        
        var directoryPath = Path.Combine(Path.GetTempPath(), "Revoicer");
        Directory.CreateDirectory(directoryPath);
        Name = $"{Path.GetRandomFileName()}-{name}";
        
        FilePath = Path.Combine(directoryPath, Name);
        Contents = File.Create(FilePath);
    }

    public string Name { get; }
    public string FilePath { get; }
    public long Size => Contents.Length;
    public string ContentType { get;  }
    public Stream Contents { get; }

    public void Dispose()
    {
        Contents.Flush();
        Contents.Dispose();
    }
}