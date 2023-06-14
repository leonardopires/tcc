using Ludikore.Revoicer.Model;

namespace Ludikore.Revoicer.Model;

/// <summary>
/// Describes a file in the system.
/// Implements the <see cref="IFileDescriptor" />
/// </summary>
/// <seealso cref="IFileDescriptor" />
public class FileDescriptor : IFileDescriptor
{
    /// <summary>
    /// Initializes a new instance of the <see cref="FileDescriptor"/> class.
    /// </summary>
    /// <remarks>Intended to be used for JSON serialization only.</remarks>
    public FileDescriptor()
    {
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="FileDescriptor"/> class.
    /// </summary>
    /// <param name="name">The name.</param>
    /// <param name="contentType">Type of the content.</param>
    /// <param name="directoryPath">The directory path.</param>
    public FileDescriptor(string name, string contentType, string directoryPath)
    {
        ContentType = contentType;
        Name = name;
        FilePath = Path.Combine(directoryPath, name);
    }

    /// <summary>
    /// Gets or sets the file name.
    /// </summary>
    /// <value>The name.</value>
    public string Name { get; set; }

    /// <summary>
    /// Gets or sets the file path.
    /// </summary>
    /// <value>The file path.</value>
    public string FilePath { get; set; }

    /// <summary>
    /// Gets or sets the type of the content.
    /// </summary>
    /// <value>The type of the content.</value>
    public string ContentType { get; set; }
}