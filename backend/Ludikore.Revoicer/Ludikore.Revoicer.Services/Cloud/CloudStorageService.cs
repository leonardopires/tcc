using Ludikore.Revoicer.Model;

namespace Ludikore.Revoicer.Services.Cloud;

/// <summary>
/// This class provides an abstraction layer for a cloud storage service such as AWS S3 or Azure BlobStorage.
/// </summary>
public abstract class CloudStorageService
{
    /// <summary>
    /// Ensures that the container or bucket exists in the storage.
    /// </summary>
    /// <param name="name">Name of the bucket or container.</param>
    /// <returns>Task.</returns>
    public abstract Task EnsureContainerExists(string name);

    /// <summary>
    /// Puts the file.
    /// </summary>
    /// <param name="containerName">Name of the container.</param>
    /// <param name="fileDescriptor">The file descriptor.</param>
    /// <returns>Task.</returns>
    public abstract Task PutFile(string containerName, IFileDescriptor fileDescriptor);

    /// <summary>
    /// Gets the file.
    /// </summary>
    /// <param name="containerName">Name of the container.</param>
    /// <param name="fileDescriptor">The file descriptor.</param>
    /// <returns>Task&lt;Stream&gt;.</returns>
    public abstract Task<Stream> GetFile(string containerName, IFileDescriptor fileDescriptor);

    /// <summary>
    /// Gets a public URL for the specified file.
    /// </summary>
    /// <param name="containerName">Name of the container.</param>
    /// <param name="file">The file.</param>
    /// <returns>Task&lt;System.String&gt;.</returns>
    public abstract Task<string> GetFileUrl(string containerName, IFileDescriptor file);
}