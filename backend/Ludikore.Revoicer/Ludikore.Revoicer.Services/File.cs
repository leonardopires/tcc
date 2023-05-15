
using System.Text.Json.Serialization;
using Microsoft.VisualBasic;

namespace Ludikore.Revoicer.Model;

public class File : IFile
{
    public File()
    {
    }

    public File(string name, string contentType, string directoryPath)
    {
        ContentType = contentType;
        Name = name;
        FilePath = Path.Combine(directoryPath, name);
    }

    public string Name { get; set; }
    
    public string FilePath { get; set; }

    public string ContentType { get; set; }
}