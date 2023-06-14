using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.AWS;
using Microsoft.AspNetCore.Components.Forms;
using System.Threading;
using Ludikore.Revoicer.API.Hubs;
using Ludikore.Revoicer.Services.Cloud;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace Ludikore.Revoicer.API.BackgroundServices
{
    public abstract class QueueListenerService<TOutput> : BackgroundService
        where TOutput : IQueueJobData
    {
        protected CloudQueueService QueueService { get;  }
        public string OutputQueue { get;  }
        public string CompleteJobName { get;  }

        protected ILogger<QueueListenerService<TOutput>> Logger { get; }

        protected IHubContext<RevoicerHub> Context { get; private set; }

        protected QueueListenerService(string outputQueue, string completeJobName, ILogger<QueueListenerService<TOutput>> logger, IHubContext<RevoicerHub> context)
        {
            var cloudFactory = new CloudProviderFactory(CloudProvider.Azure);

            QueueService = cloudFactory.GetQueueService();
            OutputQueue = outputQueue;
            CompleteJobName = completeJobName;
            Context = context;
            CompleteJobName = completeJobName;
            Logger = logger;
        }

        public override Task StartAsync(CancellationToken cancellationToken)
        {
            Logger.LogInformation("Starting listener: {0}", this.GetType().Name);
            return base.StartAsync(cancellationToken);
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                await foreach (var message in QueueService.WaitForMessage<TOutput>(OutputQueue, stoppingToken))
                {
                    Logger.LogInformation("Message received: {0}", JsonConvert.SerializeObject(message));
                    if (message.Body != null)
                    {
                        Logger.LogInformation("Sending message back to client: {0}", message.Body.JobId);
                        await Context.Clients.Client(message.Body.JobId)
                            .SendAsync(CompleteJobName, message.Body, stoppingToken);
                    }
                }
                Logger.LogInformation("Execution completed: {0}", this.GetType().Name);
            }
            catch (TaskCanceledException)
            {
                Logger.LogWarning("Listener main task has been cancelled: {0}", this.GetType().Name);

            }
            catch (Exception ex)
            {
                Logger.LogError("Error listening to the results queue: {0}", ex);
            }
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            Logger.LogInformation("Stopping listener: {0}", this.GetType().Name);
            return base.StopAsync(cancellationToken);
        }
    }
}