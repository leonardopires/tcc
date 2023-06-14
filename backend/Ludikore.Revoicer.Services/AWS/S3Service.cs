using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.Cloud;

namespace Ludikore.Revoicer.Services.AWS
{
    /// <summary>
    /// This class implements a cloud storage that uses Amazon S3Client.
    /// Implements the <see cref="CloudStorageService" />
    /// </summary>
    /// <seealso cref="CloudStorageService" />
    internal class S3Service : CloudStorageService
    {
        /// <summary>
        /// The internal S3Client service instance
        /// </summary>
        protected IAmazonS3 S3Client { get; }


        /// <summary>
        /// Initializes a new instance of the <see cref="S3Service"/> class.
        /// </summary>
        /// <param name="serviceUrl">The service URL.</param>
        public S3Service(string serviceUrl)
        {
            S3Client = new AmazonS3Client(new EnvironmentVariablesAWSCredentials(), new AmazonS3Config
            {
                ServiceURL = serviceUrl,
                ForcePathStyle = true,
            });
        }

        /// <summary>
        /// Ensures that the container or bucket exists in the storage.
        /// </summary>
        /// <param name="name">Name of the bucket or container.</param>
        /// <returns>Task.</returns>
        public override async Task EnsureContainerExists(string name)
        {
            if (!(await AmazonS3Util.DoesS3BucketExistV2Async(S3Client, name)))
            {
                var putBucketRequest = new PutBucketRequest
                {
                    BucketName = name,
                    UseClientRegion = true
                };

                var putBucketResponse = await S3Client.PutBucketAsync(putBucketRequest);
                // Retrieve the bucket location.
                var bucketLocation = await FindContainerLocationAsync(name);
                Console.WriteLine("Created bucket: {0}", bucketLocation);
            }
        }

        /// <summary>
        /// Find container location as an asynchronous operation.
        /// </summary>
        /// <param name="bucketName">Name of the bucket.</param>
        /// <returns>A Task&lt;System.String&gt; representing the asynchronous operation.</returns>
        public async Task<string> FindContainerLocationAsync(string bucketName)
        {
            var request = new GetBucketLocationRequest()
            {
                BucketName = bucketName
            };
            var response = await S3Client.GetBucketLocationAsync(request);

            var bucketLocation = response.Location.ToString();
            return bucketLocation;
        }

        /// <summary>
        /// Saves the file into the cloud storage.
        /// </summary>
        /// <param name="containerName">Name of the container.</param>
        /// <param name="fileDescriptor">The file descriptor.</param>
        /// <returns>Task.</returns>
        public override async Task PutFile(string containerName, IFileDescriptor fileDescriptor)
        {
            // 2. Put the object-set ContentType and add metadata.
            var request = new PutObjectRequest
            {
                BucketName = containerName,
                Key = fileDescriptor.FilePath,
                FilePath = fileDescriptor.FilePath,
                ContentType = fileDescriptor.ContentType,
            };

            var response = await S3Client.PutObjectAsync(request);
        }

        /// <summary>
        /// Downloads the file from the cloud storage.
        /// </summary>
        /// <param name="containerName">Name of the container.</param>
        /// <param name="fileDescriptor">The file descriptor.</param>
        /// <returns>Task&lt;Stream&gt;.</returns>
        public override async Task<Stream> GetFile(string containerName, IFileDescriptor fileDescriptor)
        {
            var localFile = Path.Combine(Path.GetTempPath(), fileDescriptor.FilePath);
            await S3Client.DownloadToFilePathAsync(containerName, fileDescriptor.FilePath, localFile, new Dictionary<string, object>());
            await using var fileStream = File.OpenRead(localFile);
            var memoryStream = new MemoryStream();
            await fileStream.CopyToAsync(memoryStream);
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
            var additionalProperties = new Dictionary<string, object>();
            var expiration = DateTime.Today.AddDays(7);

            var presignedUrl = S3Client.GeneratePreSignedURL(containerName, file.FilePath, expiration, additionalProperties);
            if (presignedUrl.StartsWith("https://localstack"))
            {
                presignedUrl = presignedUrl.Replace("https://localstack", "https://revoicer.amplifyapp.localhost.localstack.cloud");
            }
            return presignedUrl;
        }
    }
}