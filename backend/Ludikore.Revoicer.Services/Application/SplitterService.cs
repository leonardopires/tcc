using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.Cloud;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Ludikore.Revoicer.Services.Application
{
    /// <summary>
    /// Submits jobs for the splitter (demucs) worker.
    /// Implements the <see cref="RevoicerJob" />
    /// </summary>
    /// <seealso cref="RevoicerJob" />
    public class SplitterService : QueueBasedService<RevoicerJob>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SplitterService"/> class.
        /// </summary>
        public SplitterService(CloudSettings cloudSettings, CloudQueueService queueService, ILogger<SplitterService> logger) 
            : base(cloudSettings.SplitInputQueue, queueService, logger)
        {
        }
    }
}
