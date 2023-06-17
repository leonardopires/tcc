using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Azure.Storage;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.Cloud;
using Ludikore.Revoicer.Services.IO;

namespace Ludikore.Revoicer.Services.Azure
{
    /// <summary>
    /// This class implements a cloud storage service for the Azure Blob Storage.
    /// Implements the <see cref="CloudStorageService" />
    /// </summary>
    /// <seealso cref="CloudStorageService" />
    public class BlobStorageService : CloudStorageService
    {
        /// <summary>
        /// Gets the cloud settings.
        /// </summary>
        /// <value>The cloud settings.</value>
        protected CloudSettings CloudSettings { get; }


        /// <summary>
        /// Gets the service client.
        /// </summary>
        /// <value>The service client.</value>
        public BlobServiceClient ServiceClient { get; }

        /// <summary>
        /// Gets the file name formatter.
        /// </summary>
        /// <value>The file name formatter.</value>
        private FileNameFormatter FileNameFormatter { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="BlobStorageService" /> class.
        /// </summary>
        /// <param name="cloudSettings">The cloud settings.</param>
        public BlobStorageService(CloudSettings cloudSettings)
        {
            CloudSettings = cloudSettings;
            
            var connectionString = "DefaultEndpointsProtocol=https;" +
                                   $"AccountName={CloudSettings.AzureAccountName};" +
                                   $"AccountKey={CloudSettings.AzureStorageAccessKey};" +
                                   "EndpointSuffix=core.windows.net";

            ServiceClient = new BlobServiceClient(connectionString);
            FileNameFormatter = new FileNameFormatter();
        }

        /// <summary>
        /// Ensures that the container or bucket exists in the storage.
        /// </summary>
        /// <param name="name">Name of the bucket or container.</param>
        /// <returns>Task.</returns>
        public override async Task EnsureContainerExists(string name)
        {
            var blobContainerClient = ServiceClient.GetBlobContainerClient(name);
            await blobContainerClient.CreateIfNotExistsAsync();
        }

        /// <summary>
        /// Saves the file into the cloud storage.
        /// </summary>
        /// <param name="containerName">Name of the container.</param>
        /// <param name="fileDescriptor">The file descriptor.</param>
        /// <returns>Task.</returns>
        public override async Task PutFile(string containerName, IFileDescriptor fileDescriptor)
        {
            var blobContainerClient = ServiceClient.GetBlobContainerClient(containerName);
            var blobClient = blobContainerClient.GetBlobClient(fileDescriptor.FilePath);

            using var fileStream = File.OpenRead(fileDescriptor.FilePath);
            await blobClient.UploadAsync(fileStream, true);
        }

        /// <summary>
        /// Downloads the file from the cloud storage.
        /// </summary>
        /// <param name="containerName">Name of the container.</param>
        /// <param name="fileDescriptor">The file descriptor.</param>
        /// <returns>Task&lt;Stream&gt;.</returns>
        public override async Task<Stream> GetFile(string containerName, IFileDescriptor fileDescriptor)
        {
            var blobContainerClient = ServiceClient.GetBlobContainerClient(containerName);
            var blobClient = blobContainerClient.GetBlobClient(fileDescriptor.FilePath);

            var memoryStream = new MemoryStream();
            await blobClient.DownloadToAsync(memoryStream);
            memoryStream.Position = 0;
            return memoryStream;
        }

        /// <summary>
        /// Gets a public URL for the specified file.
        /// </summary>
        /// <param name="containerName">Name of the container.</param>
        /// <param name="file">The file.</param>
        /// <returns>Task&lt;System.String&gt;.</returns>
        public override async Task<string> GetFileUrl(string containerName, IFileDescriptor file)
        {
            var blobContainerClient = ServiceClient.GetBlobContainerClient(containerName);
            var fileFilePath = FileNameFormatter.RemoveRootFolderFromPath(file.FilePath);
            var blobClient = blobContainerClient.GetBlobClient(fileFilePath);

            var sasBuilder = new BlobSasBuilder(BlobContainerSasPermissions.Read, DateTimeOffset.UtcNow.AddDays(7))
            {
                BlobContainerName = containerName,
                BlobName = fileFilePath,
                Resource = "b",
                Protocol = SasProtocol.Https
            };


            var uri = blobClient.GenerateSasUri(sasBuilder);
            return uri.ToString();
            ;
        }
    }
}