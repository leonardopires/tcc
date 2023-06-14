using System.Text.RegularExpressions;
using Ludikore.Revoicer.Model;
using System.Xml.Linq;
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Util;
using Amazon.S3.Model;
using Ludikore.Revoicer.Services.AWS;
using Ludikore.Revoicer.Services.Cloud;

namespace Ludikore.Revoicer.Services.IO
{
    /// <summary>
    /// A class that provides access to the file storage in a unified way, no matter what the cloud provider is used.
    /// </summary>
    public class FileRepository
    {
        private readonly string _bucketName = "revoicer";
        public CloudStorageService CloudStorage { get; }
        public FileNameFormatter FileNameFormatter { get; }

        public FileRepository()
        {
            var cloudFactory = new CloudProviderFactory(CloudProvider.Azure);

            FileNameFormatter = new FileNameFormatter();
            CloudStorage = cloudFactory.GetStorageService();
        }

        /// <summary>
        /// Creates a file in the storage.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="contentType">The MIME Content-Type.</param>
        /// <param name="contents">The contents.</param>
        /// <returns>IFileDescriptor.</returns>
        public async Task<IFileDescriptor> CreateFile(string name, string contentType, Stream contents)
        {
            var guid = Guid.NewGuid().ToString();
            var actualName = FileNameFormatter.SanitizeFileName(name);
            var directoryPath = Path.Combine("/data/input", guid);

            Directory.CreateDirectory(directoryPath);

            var file = new FileDescriptor(actualName, contentType, directoryPath);


            await using (var fileStream = File.Create(file.FilePath))
            {
                await contents.CopyToAsync(fileStream);
            }

            await CloudStorage.EnsureContainerExists(_bucketName);

            await CloudStorage.PutFile(_bucketName, file);

            return file;
        }

        /// <summary>
        /// Retrieves a file from the storage.
        /// </summary>
        /// <param name="file">The file.</param>
        /// <returns>Stream.</returns>
        public async Task<Stream> GetFile(IFileDescriptor file)
        {
            return await CloudStorage.GetFile(_bucketName, file);
        }

        /// <summary>
        /// Retrieves the URL of a file in the storage
        /// </summary>
        /// <param name="file">The file.</param>
        /// <returns>System.String.</returns>
        public async Task<string> GetFileUrl(IFileDescriptor file)
        {
            return await CloudStorage.GetFileUrl(_bucketName, file);
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