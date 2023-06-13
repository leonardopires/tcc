using System.Runtime.CompilerServices;
using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace Ludikore.Revoicer.API.Hubs
{
    public class RevoicerHub : Hub
    {
        public async IAsyncEnumerable<DateTime> Streaming([EnumeratorCancellation] CancellationToken cancellationToken)
        {
            while (true)
            {
                yield return DateTime.UtcNow;
                await Task.Delay(1000, cancellationToken);
            }
        }

        public async Task SplitSong(RevoicerJob song)
        {
            song.JobId = this.Context.ConnectionId;
            var service = new SplitterService();

            await service.SubmitJob(song);
        }

        public async Task RevoiceSong(RevoicerJob song)
        {
            song.JobId = this.Context.ConnectionId;
            var service = new RevoicerService();

            await service.SubmitJob(song);
        }
    }
}
