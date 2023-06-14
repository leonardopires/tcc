using Ludikore.Revoicer.API.Hubs;
using Ludikore.Revoicer.Services;
using Microsoft.AspNetCore.SignalR;

namespace Ludikore.Revoicer.API.BackgroundServices
{
    /// <summary>
    /// This service listens to the Revoicer service output queue and returns feedback to the user
    /// Implements the <see cref="Ludikore.Revoicer.API.BackgroundServices.QueueListenerService{Ludikore.Revoicer.Services.RevoicerJob}" />
    /// </summary>
    /// <seealso cref="Ludikore.Revoicer.API.BackgroundServices.QueueListenerService{Ludikore.Revoicer.Services.RevoicerJob}" />
    public class RevoicerListenerService : QueueListenerService<RevoicerJob>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="RevoicerListenerService"/> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        /// <param name="context">The context.</param>
        public RevoicerListenerService(ILogger<QueueListenerService<RevoicerJob>> logger, IHubContext<RevoicerHub> context) 
            : base("revoicer-svc-output.fifo", "RevoiceComplete", logger, context)
        {
            
        }
    }
}
