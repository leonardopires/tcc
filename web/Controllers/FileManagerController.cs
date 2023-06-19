using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services;
using Ludikore.Revoicer.Services.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Serilog;

namespace Ludikore.Revoicer.Web.Controllers
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
        /// Initializes a new instance of the <see cref="FileManagerController"/> class.
        /// </summary>
        /// <param name="fileRepository">The file repository.</param>
        /// <param name="logger">The logger instance.</param>
        public FileManagerController(FileRepository fileRepository, ILogger<FileManagerController> logger)
        {
            FileRepository = fileRepository;
            Logger = logger;
        }

        /// <summary>
        /// Gets the file repository.
        /// </summary>
        /// <value>The file repository.</value>
        private FileRepository FileRepository { get; }

        /// <summary>
        /// Gets the logger instance.
        /// </summary>
        private ILogger<FileManagerController> Logger { get; }

        /// <summary>
        /// Allows the user to upload files into our cloud storage.
        /// </summary>
        /// <returns>IList&lt;RevoicerJob&gt;.</returns>
        [HttpPost("upload")]
        public async Task<IList<RevoicerJob>> UploadFiles()
        {
            var result = new List<RevoicerJob>();

            foreach (var formFile in Request.Form.Files)
            {
                await using var contents = formFile.OpenReadStream();
                var fileDescriptor = await FileRepository.CreateFile(formFile.Name, formFile.ContentType, contents);

                Logger.LogInformation("File created: {FileDescriptorFilePath}", fileDescriptor.FilePath);

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
        /// Retrieves a publicly visible URL to a file at the cloud storage provider and redirects to it.
        /// </summary>
        /// <param name="filePath">The file path.</param>
        /// <returns><see cref="ActionResult"/></returns>
        /// <exception cref="System.IO.IOException">Could not obtain a directory from path: {filePath}</exception>
        [HttpGet("redirect")]
        public async Task<ActionResult> RedirectToFile([FromQuery] string filePath)
        {
            var directoryPath = Path.GetDirectoryName(filePath);

            if (directoryPath == null)
            {
                return new NotFoundObjectResult($"Could not obtain a directory from path: {filePath}");
            }

            var fileName = Path.GetFileName(filePath);

            var provider = new FileExtensionContentTypeProvider();


            if (!provider.TryGetContentType(fileName, out var contentType))
            {
                contentType = "audio/mpeg";
            }

            var file = new FileDescriptor(fileName, contentType, directoryPath);

            try
            {
                Logger.LogInformation("Getting file {FileName} from cloud storage", file.Name);
                var url = await FileRepository.GetFileUrl(file);
                Logger.LogInformation("Redirecting to URL: {Url}", url);
                return Redirect(url);
            }
            finally
            {
                Logger.LogInformation("Response sent");
            }
        }
    }
}