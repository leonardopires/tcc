using Ludikore.Revoicer.API.Hubs;
using Ludikore.Revoicer.Services;
using Microsoft.AspNetCore.SignalR;

namespace Ludikore.Revoicer.API.BackgroundServices
{
    public class SplitterListenerService : QueueListenerService<RevoicerJob>
    {
        public SplitterListenerService(ILogger<QueueListenerService<RevoicerJob>> logger, IHubContext<RevoicerHub> context)
            : base("revoicer-demucs-output.fifo", "SplitComplete", logger, context)
        {

        }
    }
}
