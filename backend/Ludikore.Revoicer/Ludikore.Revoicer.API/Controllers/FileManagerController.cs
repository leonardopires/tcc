using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Ludikore.Revoicer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileManagerController : ControllerBase
    {
        [HttpPost("upload")]
        public async Task<IList<IAudioFile>> UploadFiles(IList<IFormFile> files)
        {
            var result = new List<IAudioFile>();
            var fileRepository = new FileRepository();

            foreach (var formFile in Request.Form.Files)
            {
                var file = fileRepository.CreateFile(formFile.Name, formFile.ContentType);
                await using var fileStream = file.Open();
                await formFile.CopyToAsync(fileStream);
                Console.WriteLine($"File created: {file.FilePath}");
                result.Add(file);
            }

            return result;
        }
    }
}
