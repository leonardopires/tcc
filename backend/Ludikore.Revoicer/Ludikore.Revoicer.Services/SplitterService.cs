using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.AWS;

namespace Ludikore.Revoicer.Services
{
    public class SplitterService
    {
        private SQSFacade sqs;

        public SplitterService()
        {
            sqs = new SQSFacade();
        }

        public async Task SubmitFile(IFile file)
        {
            await sqs.SendMessage("revoicer-demucs", file);
        }
    }
}
