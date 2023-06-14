using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services;
using Ludikore.Revoicer.Services.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace Ludikore.Revoicer.API.Controllers
{
    /// <summary>
    /// This controller allows the client to upload and download files from our cloud storage.
    /// Implements the <see cref="ControllerBase" />
    /// </summary>
    /// <seealso cref="ControllerBase" />
    [Route("api/[controller]")]
    [ApiController]
    public class FileManagerController : ControllerBase
    {
        /// <summary>
        /// Allows the user to upload files into our cloud storage.
        /// </summary>
        /// <param name="files">The files.</param>
        /// <returns>IList&lt;RevoicerJob&gt;.</returns>
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

        /// <summary>
        /// Retrieves a file from the cloud storage and sends it as a download.
        /// </summary>
        /// <remarks>This is a fallback method and should be used carefully (since it's slower and consumes more bandwidth from the servers).</remarks>
        /// <param name="filePath">The file path.</param>
        /// <returns>FileContentResult.</returns>
        [HttpGet("download")]
        public async Task<FileContentResult> DownloadFile([FromQuery] string filePath)
        {
            var directoryPath = Path.GetDirectoryName(filePath);
            var fileName = Path.GetFileName(filePath);

            var file = new FileDescriptor(fileName, "audio/wav", directoryPath);
            var fileRepository = new FileRepository();
            try
            {
                Console.WriteLine("Getting file from cloud storage");
                await using var stream = await fileRepository.GetFile(file) as MemoryStream;
                Console.WriteLine("Creating response");
                return new FileContentResult(stream.ToArray(), "application/octet-stream")
                {
                    FileDownloadName = file.Name,
                };
            }
            finally
            {
                Console.WriteLine("Response sent");
            }
        }

        /// <summary>
        /// Retrieves a publicly visible URL to a file at the cloud storage provider and redirects to it.
        /// </summary>
        /// <remarks>
        /// It is preferable to use this rather than the <see cref="DownloadFile"/> action.
        /// </remarks>
        /// <param name="filePath">The file path.</param>
        /// <returns>RedirectResult.</returns>
        /// <exception cref="System.IO.IOException">Could not obtain a directory from path: {filePath}</exception>
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
                Console.WriteLine("Getting file {0} from cloud storage", file.Name);
                var url = await fileRepository.GetFileUrl(file);
                Console.WriteLine("Redirecting to URL: {0}", url);
                return Redirect(url);
            }
            finally
            {
                Console.WriteLine("Response sent");
            }
        }
    }
}