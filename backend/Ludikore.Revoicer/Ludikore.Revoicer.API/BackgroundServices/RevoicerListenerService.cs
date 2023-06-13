using Ludikore.Revoicer.API.Hubs;
using Ludikore.Revoicer.Services;
using Microsoft.AspNetCore.SignalR;

namespace Ludikore.Revoicer.API.BackgroundServices
{
    public class RevoicerListenerService : QueueListenerService<RevoicerJob>
    {
        public RevoicerListenerService(ILogger<QueueListenerService<RevoicerJob>> logger, IHubContext<RevoicerHub> context) 
            : base("revoicer-svc-output.fifo", "RevoiceComplete", logger, context)
        {
            
        }
    }
}
