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
    internal class S3Service : CloudStorageService
    {
        private IAmazonS3 s3;


        public S3Service(string serviceUrl)
        {
            s3 = new AmazonS3Client(new EnvironmentVariablesAWSCredentials(), new AmazonS3Config
            {
                ServiceURL = serviceUrl,
                ForcePathStyle = true,
            });
        }

        public override async Task EnsureContainerExists(string name)
        {
            if (!(await AmazonS3Util.DoesS3BucketExistV2Async(s3, name)))
            {
                var putBucketRequest = new PutBucketRequest
                {
                    BucketName = name,
                    UseClientRegion = true
                };

                var putBucketResponse = await s3.PutBucketAsync(putBucketRequest);
                // Retrieve the bucket location.
                var bucketLocation = await FindContainerLocationAsync(name);
                Console.WriteLine("Created bucket: {0}", bucketLocation);
            }
        }

        public async Task<string> FindContainerLocationAsync(string bucketName)
        {
            var request = new GetBucketLocationRequest()
            {
                BucketName = bucketName
            };
            var response = await s3.GetBucketLocationAsync(request);

            var bucketLocation = response.Location.ToString();
            return bucketLocation;
        }

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

            var response = await s3.PutObjectAsync(request);
        }

        public override async Task<Stream> GetFile(string containerName, IFileDescriptor fileDescriptor)
        {
            var localFile = Path.Combine(Path.GetTempPath(), fileDescriptor.FilePath);
            await s3.DownloadToFilePathAsync(containerName, fileDescriptor.FilePath, localFile, new Dictionary<string, object>());
            await using var fileStream = File.OpenRead(localFile);
            var memoryStream = new MemoryStream();
            await fileStream.CopyToAsync(memoryStream);
            return memoryStream;
        }

        public override async Task<string> GetFileUrl(string containerName, IFileDescriptor file)
        {
            var additionalProperties = new Dictionary<string, object>();
            var expiration = DateTime.Today.AddDays(7);

            var presignedUrl = s3.GeneratePreSignedURL(containerName, file.FilePath, expiration, additionalProperties);
            if (presignedUrl.StartsWith("https://localstack"))
            {
                presignedUrl = presignedUrl.Replace("https://localstack", "https://revoicer.amplifyapp.localhost.localstack.cloud");
            }
            return presignedUrl;
        }
    }
}