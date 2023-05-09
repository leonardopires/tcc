
namespace Ludikore.Revoicer.Model
{
    public interface IAudioFile 
    {
        string Name { get; }
        string FilePath { get; }
        string ContentType { get; }
        Stream Open();
    }
}