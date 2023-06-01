namespace Ludikore.Revoicer.Model;

public interface IFileDescriptor
{
    string Name { get; set; }
    string FilePath { get; set; }
    string ContentType { get; set; }

}