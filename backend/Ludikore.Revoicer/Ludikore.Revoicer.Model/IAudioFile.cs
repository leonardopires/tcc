
namespace Ludikore.Revoicer.Model
{
    public interface IAudioFile : IDisposable
    {
        string Name { get; }
        string FilePath { get; }
        long Size { get; }
        string ContentType { get; }
        Stream Contents { get; }}
    }
}