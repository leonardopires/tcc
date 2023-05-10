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
        public async Task<IList<IFile>> UploadFiles(IList<IFormFile> files)
        {
            var result = new List<IFile>();
            var fileRepository = new FileRepository();
            var splitter = new SplitterService();

            foreach (var formFile in Request.Form.Files)
            {
                await using var contents = formFile.OpenReadStream();
                var file = await fileRepository.CreateFile(formFile.Name, formFile.ContentType, contents);
                
                Console.WriteLine($"File created: {file.FilePath}");
                result.Add(file);
            }

            return result;
        }
    }
}
