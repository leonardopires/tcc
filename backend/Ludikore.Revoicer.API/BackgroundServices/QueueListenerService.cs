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
    /// <summary>
    /// This is the base class for a service that listens to the output of a cloud queue and sends the results to the client using websockets.
    /// Implements the <see cref="Microsoft.Extensions.Hosting.BackgroundService" />
    /// </summary>
    /// <typeparam name="TOutput">The type of the t output.</typeparam>
    /// <seealso cref="Microsoft.Extensions.Hosting.BackgroundService" />
    public abstract class QueueListenerService<TOutput> : BackgroundService
        where TOutput : IWorkerJobData
    {
        /// <summary>
        /// Gets the queue service.
        /// </summary>
        /// <value>The queue service.</value>
        protected CloudQueueService QueueService { get;  }
        /// <summary>
        /// Gets the output queue.
        /// </summary>
        /// <value>The output queue.</value>
        public string OutputQueue { get;  }
        /// <summary>
        /// Gets the name of the complete job.
        /// </summary>
        /// <value>The name of the complete job.</value>
        public string CompleteJobName { get;  }

        /// <summary>
        /// Gets the logger.
        /// </summary>
        /// <value>The logger.</value>
        protected ILogger<QueueListenerService<TOutput>> Logger { get; }

        /// <summary>
        /// Gets the context.
        /// </summary>
        /// <value>The context.</value>
        protected IHubContext<RevoicerHub> Context { get; private set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="QueueListenerService{TOutput}"/> class.
        /// </summary>
        /// <param name="outputQueue">The output queue.</param>
        /// <param name="completeJobName">Name of the complete job.</param>
        /// <param name="logger">The logger.</param>
        /// <param name="context">The context.</param>
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

        /// <summary>
        /// Triggered when the application host is ready to start the service.
        /// </summary>
        /// <param name="cancellationToken">Indicates that the start process has been aborted.</param>
        /// <returns>Task.</returns>
        public override Task StartAsync(CancellationToken cancellationToken)
        {
            Logger.LogInformation("Starting listener: {0}", this.GetType().Name);
            return base.StartAsync(cancellationToken);
        }

        /// <summary>
        /// Execute as an asynchronous operation.
        /// </summary>
        /// <param name="stoppingToken">Triggered when <see cref="M:Microsoft.Extensions.Hosting.IHostedService.StopAsync(System.Threading.CancellationToken)" /> is called.</param>
        /// <returns>A Task representing the asynchronous operation.</returns>
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

        /// <summary>
        /// Triggered when the application host is performing a graceful shutdown.
        /// </summary>
        /// <param name="cancellationToken">Indicates that the shutdown process should no longer be graceful.</param>
        /// <returns>Task.</returns>
        public override Task StopAsync(CancellationToken cancellationToken)
        {
            Logger.LogInformation("Stopping listener: {0}", this.GetType().Name);
            return base.StopAsync(cancellationToken);
        }
    }
}