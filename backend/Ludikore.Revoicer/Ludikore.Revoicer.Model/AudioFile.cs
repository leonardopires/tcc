
namespace Ludikore.Revoicer.Model;

public class AudioFile : IAudioFile, IDisposable
{
    public AudioFile(string name, string contentType)
    {
        Name = name;
        ContentType = contentType;
        FilePath = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName(), name);
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