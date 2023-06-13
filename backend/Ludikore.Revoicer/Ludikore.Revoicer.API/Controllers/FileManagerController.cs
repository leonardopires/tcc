using System.Net.Mime;
using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace Ludikore.Revoicer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileManagerController : ControllerBase
    {
        [HttpPost("upload")]
        public async Task<IList<RevoicerJob>> UploadFiles(IList<IFormFile> files)
        {
            var result = new List<RevoicerJob>();
            var fileRepository = new FileRepository();
            var splitter = new SplitterService();

            foreach (var formFile in Request.Form.Files)
            {
                await using var contents = formFile.OpenReadStream();
                var fileDescriptor = await fileRepository.CreateFile(formFile.Name, formFile.ContentType, contents);

                Console.WriteLine($"File created: {fileDescriptor.FilePath}");

                var filePath = fileDescriptor.FilePath.StartsWith("/")
                    ? fileDescriptor.FilePath.Substring(1)
                    : fileDescriptor.FilePath;
                var jobInput = new RevoicerJob()
                {
                    ContentType = fileDescriptor.ContentType,
                    FilePath = filePath,
                    Name = fileDescriptor.Name,
                    OperationId = Guid.NewGuid().ToString(),
                    Input =
                    {
                        filePath,
                    },
                };

                result.Add(jobInput);
            }

            return result;
        }

        [HttpGet("download")]
        public async Task<FileContentResult> DownloadFile([FromQuery] string filePath)
        {
            var directoryPath = Path.GetDirectoryName(filePath);
            var fileName = Path.GetFileName(filePath);

            var file = new FileDescriptor(fileName, "audio/wav", directoryPath);
            var fileRepository = new FileRepository();
            try
            {
                Console.WriteLine("Getting file from S3");
                await using var stream = await fileRepository.GetFile(file) as MemoryStream;
                Console.WriteLine("Creating response");
                return new FileContentResult(stream.ToArray(), "application/octet-stream");
            }
            finally
            {
                Console.WriteLine("Response sent");
            }
        }

        [HttpGet("redirect")]
        public async Task<RedirectResult> RedirectToFile([FromQuery] string filePath)
        {
            var directoryPath = Path.GetDirectoryName(filePath);

            if (directoryPath == null)
            {
                throw new IOException($"Could not obtain a directory from path: {filePath}");
            }

            var fileName = Path.GetFileName(filePath);

            var provider = new FileExtensionContentTypeProvider();


            if (!provider.TryGetContentType(fileName, out var contentType))
            {
                contentType = "audio/mpeg";
            }

            var file = new FileDescriptor(fileName, contentType, directoryPath);
            var fileRepository = new FileRepository();
            try
            {
                Console.WriteLine("Getting file from S3");
                var url = await fileRepository.GetFileUrl(file);
                Console.WriteLine("Redirecting to S3 URL: {0}", url);
                return Redirect(url);
            }
            finally
            {
                Console.WriteLine("Response sent");
            }
        }
    }
}