using Ludikore.Revoicer.Model;
using System.Xml.Linq;
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Util;
using Amazon.S3.Model;
using Ludikore.Revoicer.Services.AWS;
using File = Ludikore.Revoicer.Model.File;

namespace Ludikore.Revoicer.Services
{
    public class FileRepository
    {
        private readonly string _bucketName = "revoicer";
        private readonly S3Facade s3;

        public FileRepository()
        {
            s3 = new S3Facade();
        }

        public async Task<IFile> CreateFile(string name, string contentType, Stream contents)
        {
            var actualName = string.Join(string.Empty, name.Where(c => !Path.GetInvalidFileNameChars().Contains(c)));
            var directoryPath = Path.Combine("/data", Guid.NewGuid().ToString());
            Directory.CreateDirectory(directoryPath);

            var file = new File(name, contentType, directoryPath);


            await using (var fileStream = System.IO.File.Create(file.FilePath))
            {
                await contents.CopyToAsync(fileStream);
            }

            await s3.EnsureBucketExists(_bucketName);

            await s3.PutFile(_bucketName, file);

            return file;
        }

    }
}