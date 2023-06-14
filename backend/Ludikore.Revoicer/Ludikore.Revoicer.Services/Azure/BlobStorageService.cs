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
    internal class BlobStorageService : CloudStorageService
    {
        private readonly string _sasAccountKey;
        public BlobServiceClient ServiceClient { get; }
        private FileNameFormatter FileNameFormatter { get; }

        public BlobStorageService(string connectionString, string sasAccountKey)
        {
            _sasAccountKey = sasAccountKey;
            ServiceClient = new BlobServiceClient(connectionString);
            FileNameFormatter = new FileNameFormatter();
        }

        public override async Task EnsureContainerExists(string name)
        {
            var blobContainerClient = ServiceClient.GetBlobContainerClient(name);
            await blobContainerClient.CreateIfNotExistsAsync(PublicAccessType.None);
        }

        public override async Task PutFile(string containerName, IFileDescriptor fileDescriptor)
        {
            var blobContainerClient = ServiceClient.GetBlobContainerClient(containerName);
            var blobClient = blobContainerClient.GetBlobClient(fileDescriptor.FilePath);

            using var fileStream = File.OpenRead(fileDescriptor.FilePath);
            await blobClient.UploadAsync(fileStream, true);
        }

        public override async Task<Stream> GetFile(string containerName, IFileDescriptor fileDescriptor)
        {
            var blobContainerClient = ServiceClient.GetBlobContainerClient(containerName);
            var blobClient = blobContainerClient.GetBlobClient(fileDescriptor.FilePath);

            var memoryStream = new MemoryStream();
            await blobClient.DownloadToAsync(memoryStream);
            memoryStream.Position = 0;
            return memoryStream;
        }

        public override async Task<string> GetFileUrl(string containerName, IFileDescriptor file)
        {
            var blobContainerClient = ServiceClient.GetBlobContainerClient(containerName);
            var fileFilePath = FileNameFormatter.RemoveRootFolderName(file.FilePath);
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