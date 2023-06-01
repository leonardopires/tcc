using Ludikore.Revoicer.Model;

namespace Ludikore.Revoicer.Model;

public class FileDescriptor : IFileDescriptor
{
    public FileDescriptor()
    {
    }

    public FileDescriptor(string name, string contentType, string directoryPath)
    {
        ContentType = contentType;
        Name = name;
        FilePath = Path.Combine(directoryPath, name);
    }

    public string Name { get; set; }

    public string FilePath { get; set; }

    public string ContentType { get; set; }
}