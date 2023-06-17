using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.Cloud;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Ludikore.Revoicer.Services.Application;

/// <summary>
/// Submits jobs for the Revoicer (SVC) worker.
/// </summary>
public class RevoicerService : QueueBasedService<RevoicerJob>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="RevoicerService" /> class.
    /// </summary>
    /// <param name="queueService">The queue service.</param>
    /// <param name="logger">The logger.</param>
    /// <param name="cloudSettings">The cloud settings.</param>
    public RevoicerService(CloudQueueService queueService, ILogger<RevoicerService> logger, CloudSettings cloudSettings)
        : base(cloudSettings.RevoiceInputQueue, queueService, logger)
    {
    }
}