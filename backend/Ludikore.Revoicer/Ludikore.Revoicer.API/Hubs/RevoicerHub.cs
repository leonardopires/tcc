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

            await EnqueueJob(song, service, "SplitComplete");
        }

        public async Task RevoiceSong(RevoicerJob song)
        {
            song.JobId = this.Context.ConnectionId;
            var service = new VocalChangerService();

            await EnqueueJob(song, service, "RevoiceComplete");
        }

        private async Task EnqueueJob<T>(T song, QueueBasedService<T, T> service, string completeJobName) where T : IQueueJobData
        {
            var completed = false;
            try
            {
                var cancellationTokenSource = new CancellationTokenSource();
                cancellationTokenSource.CancelAfter(TimeSpan.FromSeconds(120));
                var cancellationToken = cancellationTokenSource.Token;

                await foreach (var result in service.SubmitJob(song, cancellationToken))
                {
                    await Clients.Client(result.JobId).SendAsync(completeJobName, result, cancellationToken);

                    if (result.JobId == song.JobId)
                    {
                        completed = true;
                        cancellationTokenSource.Cancel();
                        break;
                    }
                }
            }
            catch (TaskCanceledException e)
            {
                if (completed)
                {
                    Console.WriteLine("Task completed");
                }
                else
                {
                    Console.WriteLine("Task timed out: {0}", e);
                }
            }
        }
    }
}
