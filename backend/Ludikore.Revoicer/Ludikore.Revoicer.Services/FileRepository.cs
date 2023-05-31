using System.Text.RegularExpressions;
using Ludikore.Revoicer.Model;
using System.Xml.Linq;
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Util;
using Amazon.S3.Model;
using Ludikore.Revoicer.Services.AWS;

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

        public async Task<IFileDescriptor> CreateFile(string name, string contentType, Stream contents)
        {
            var guid = Guid.NewGuid().ToString();
            var extension = Path.GetExtension(name);
            var extensionlessName = Path.GetFileNameWithoutExtension(name);
            var sanitizedName = Regex.Replace(extensionlessName, "[^A-z0-9]+|\\+", string.Empty);
            var actualName = Path.ChangeExtension($"{guid}_{sanitizedName}", extension);
            var directoryPath = Path.Combine("/data/input", guid);

            Directory.CreateDirectory(directoryPath);

            var file = new FileDescriptor(actualName, contentType, directoryPath);


            await using (var fileStream = File.Create(file.FilePath))
            {
                await contents.CopyToAsync(fileStream);
            }

            await s3.EnsureBucketExists(_bucketName);

            await s3.PutFile(_bucketName, file);

            return file;
        }

        public async Task<Stream> GetFile(IFileDescriptor file)
        {
            return await s3.GetFile(_bucketName, file);
        }

        public void DeleteFile(FileDescriptor file)
        {
            File.Delete(file.FilePath);
        }
    }
}