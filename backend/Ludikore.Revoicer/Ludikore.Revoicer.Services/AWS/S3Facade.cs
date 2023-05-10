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

namespace Ludikore.Revoicer.Services.AWS
{
    internal class S3Facade
    {
        private IAmazonS3 s3;


        public S3Facade()
        {
            s3 = new AmazonS3Client(new EnvironmentVariablesAWSCredentials(), new AmazonS3Config
            {
                ServiceURL = "http://localstack:4566",
                ForcePathStyle = true,
            });
        }

        public async Task EnsureBucketExists(string bucketName)
        {
            if (!(await AmazonS3Util.DoesS3BucketExistV2Async(s3, bucketName)))
            {
                var putBucketRequest = new PutBucketRequest
                {
                    BucketName = bucketName,
                    UseClientRegion = true
                };

                var putBucketResponse = await s3.PutBucketAsync(putBucketRequest);
                // Retrieve the bucket location.
                var bucketLocation = await FindBucketLocationAsync(bucketName);
                Console.WriteLine("Created bucket: {0}", bucketLocation);
            }
        }

        public async Task<string> FindBucketLocationAsync(string bucketName)
        {
            var request = new GetBucketLocationRequest()
            {
                BucketName = bucketName
            };
            var response = await s3.GetBucketLocationAsync(request);

            var bucketLocation = response.Location.ToString();
            return bucketLocation;
        }

        public async Task PutFile(string bucketName, IFile file)
        {
            // 2. Put the object-set ContentType and add metadata.
            var request = new PutObjectRequest
            {
                BucketName = bucketName,
                Key = file.FilePath,
                FilePath = file.FilePath,
                ContentType = file.ContentType,
            };

            var response = await s3.PutObjectAsync(request);
        }
    }
}