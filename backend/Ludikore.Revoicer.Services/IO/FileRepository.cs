using System.Text.RegularExpressions;
using Ludikore.Revoicer.Model;
using System.Xml.Linq;
using Amazon;
using Amazon.Runtime;
using Amazon.Runtime.Internal.Util;
using Amazon.S3;
using Amazon.S3.Util;
using Amazon.S3.Model;
using Ludikore.Revoicer.Services.AWS;
using Ludikore.Revoicer.Services.Cloud;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Ludikore.Revoicer.Services.IO
{
    /// <summary>
    /// A class that provides access to the file storage in a unified way, no matter what the cloud provider is used.
    /// </summary>
    public class FileRepository
    {
        /// <summary>
        /// Gets the cloud settings.
        /// </summary>
        /// <value>The cloud settings.</value>
        private CloudSettings CloudSettings { get; }
        /// <summary>
        /// Gets the logger.
        /// </summary>
        /// <value>The logger.</value>
        private ILogger<FileRepository> Logger { get; }

        /// <summary>
        /// Gets the name of the container.
        /// </summary>
        /// <value>The name of the container.</value>
        public string ContainerName { get; }

        /// <summary>
        /// Gets the cloud storage.
        /// </summary>
        /// <value>The cloud storage.</value>
        public CloudStorageService CloudStorage { get; }
        /// <summary>
        /// Gets the file name formatter.
        /// </summary>
        /// <value>The file name formatter.</value>
        public FileNameFormatter FileNameFormatter { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="FileRepository" /> class.
        /// </summary>
        /// <param name="cloudSettings">The cloud settings.</param>
        /// <param name="logger">The logger.</param>
        /// <param name="cloudStorage">The cloud storage.</param>
        public FileRepository(CloudSettings cloudSettings, ILogger<FileRepository> logger, CloudStorageService cloudStorage)
        {
            CloudSettings = cloudSettings;
            Logger = logger;
            FileNameFormatter = new FileNameFormatter();
            CloudStorage = cloudStorage;
            ContainerName = CloudSettings.AzureStorageContainerName;
        }

        /// <summary>
        /// Creates a file in the storage.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="contentType">The MIME Content-Type.</param>
        /// <param name="contents">A stream containing the contents of the file.</param>
        /// <returns>IFileDescriptor.</returns>
        public async Task<IFileDescriptor> CreateFile(string name, string contentType, Stream contents)
        {
            var guid = Guid.NewGuid().ToString();
            var actualName = FileNameFormatter.SanitizeFileName(name);
            var directoryPath = Path.Combine("/data", guid, "input");

            Logger.LogInformation("Creating directory: {0}", directoryPath);
            Directory.CreateDirectory(directoryPath);

            var file = new FileDescriptor(actualName, contentType, directoryPath);


            Logger.LogInformation("Creating file: {0}", directoryPath);
            await using (var fileStream = File.Create(file.FilePath))
            {
                await contents.CopyToAsync(fileStream);
            }

            await CloudStorage.EnsureContainerExists(ContainerName);

            await CloudStorage.PutFile(ContainerName, file);

            return file;
        }

        /// <summary>
        /// Retrieves a file from the storage.
        /// </summary>
        /// <param name="file">The file.</param>
        /// <returns>Stream.</returns>
        public async Task<Stream> GetFile(IFileDescriptor file)
        {
            return await CloudStorage.GetFile(ContainerName, file);
        }

        /// <summary>
        /// Retrieves the URL of a file in the storage
        /// </summary>
        /// <param name="file">The file.</param>
        /// <returns>System.String.</returns>
        public async Task<string> GetFileUrl(IFileDescriptor file)
        {
            return await CloudStorage.GetFileUrl(ContainerName, file);
        }

        /// <summary>
        /// Deletes the file in the storage.
        /// </summary>
        /// <param name="file">The file.</param>
        public void DeleteFile(FileDescriptor file)
        {
            File.Delete(file.FilePath);
        }
    }
}