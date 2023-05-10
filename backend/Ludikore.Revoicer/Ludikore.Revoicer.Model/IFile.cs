
namespace Ludikore.Revoicer.Model
{
    public interface IFile 
    {
        string Name { get; }
        string FilePath { get; }
        string ContentType { get; }
    }
}