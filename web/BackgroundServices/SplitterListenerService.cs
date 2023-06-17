using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.Cloud;
using Ludikore.Revoicer.Web.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Ludikore.Revoicer.Web.BackgroundServices
{
    /// <summary>
    /// This service listens to the splitter queue so we can return the results to the user.
    /// Implements the <see cref="QueueListenerService{RevoicerJob}" />
    /// </summary>
    /// <seealso cref="QueueListenerService{RevoicerJob}" />
    public class SplitterListenerService : QueueListenerService<RevoicerJob>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SplitterListenerService" /> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="context">The context.</param>
        /// <param name="queueService">The queue service.</param>
        /// <param name="cloudSettings">The cloud settings.</param>
        public SplitterListenerService(
            ILogger<QueueListenerService<RevoicerJob>> logger,
            IHubContext<RevoicerHub> context,
            CloudQueueService queueService,
            CloudSettings cloudSettings
        )
            : base(cloudSettings.SplitOutputQueue, "SplitComplete", logger, context, queueService)
        {
        }
    }
}