using Ludikore.Revoicer.API.Hubs;
using Ludikore.Revoicer.Services;
using Microsoft.AspNetCore.SignalR;

namespace Ludikore.Revoicer.API.BackgroundServices
{
    /// <summary>
    /// This service listens to the splitter queue so we can return the results to the user.
    /// Implements the <see cref="Ludikore.Revoicer.API.BackgroundServices.QueueListenerService{Ludikore.Revoicer.Services.RevoicerJob}" />
    /// </summary>
    /// <seealso cref="Ludikore.Revoicer.API.BackgroundServices.QueueListenerService{Ludikore.Revoicer.Services.RevoicerJob}" />
    public class SplitterListenerService : QueueListenerService<RevoicerJob>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SplitterListenerService"/> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="context">The context.</param>
        public SplitterListenerService(ILogger<QueueListenerService<RevoicerJob>> logger, IHubContext<RevoicerHub> context)
            : base("revoicer-demucs-output.fifo", "SplitComplete", logger, context)
        {

        }
    }
}
