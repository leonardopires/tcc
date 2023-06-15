using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.Cloud;
using Ludikore.Revoicer.Web.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Ludikore.Revoicer.Web.BackgroundServices
{
    /// <summary>
    /// This service listens to the Revoicer service output queue and returns feedback to the user
    /// Implements the <see cref="QueueListenerService{RevoicerJob}" />
    /// </summary>
    /// <seealso cref="QueueListenerService{RevoicerJob}" />
    public class RevoicerListenerService : QueueListenerService<RevoicerJob>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="RevoicerListenerService" /> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="context">The context.</param>
        /// <param name="queueService">The queue service.</param>
        /// <param name="cloudSettings">The cloud settings.</param>
        public RevoicerListenerService(
            ILogger<RevoicerListenerService> logger, 
            IHubContext<RevoicerHub> context,
            CloudQueueService queueService,
            CloudSettings cloudSettings
            ) 
            : base(cloudSettings.RevoiceOutputQueue, "RevoiceComplete", logger, context, queueService)
        {
            
        }
    }
}
