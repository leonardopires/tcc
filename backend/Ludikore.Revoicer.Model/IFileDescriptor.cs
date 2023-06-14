namespace Ludikore.Revoicer.Model;

/// <summary>
/// Describes a file in the system.
/// </summary>
public interface IFileDescriptor
{
    /// <summary>
    /// Gets or sets the file name.
    /// </summary>
    /// <value>The name.</value>
    string Name { get; set; }
    /// <summary>
    /// Gets or sets the file path.
    /// </summary>
    /// <value>The file path.</value>
    string FilePath { get; set; }
    /// <summary>
    /// Gets or sets the type of the content.
    /// </summary>
    /// <value>The type of the content.</value>
    string ContentType { get; set; }

}