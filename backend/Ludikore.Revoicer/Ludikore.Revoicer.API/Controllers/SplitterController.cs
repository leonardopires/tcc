using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using File = Ludikore.Revoicer.Model.File;

namespace Ludikore.Revoicer.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SplitterController : ControllerBase
    {
        [HttpPost("split")]
        public async Task<List<IFile>> Split([FromBody]File file)
        {
            var service = new SplitterService();
            await service.SubmitFile(file);
            return new List<IFile>(new[] { file });
        }
    }
}
