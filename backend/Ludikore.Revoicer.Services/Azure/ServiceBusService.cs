using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;
using Ludikore.Revoicer.Services.Cloud;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Ludikore.Revoicer.Services.Azure
{
    /// <summary>
    /// Implements a cloud queue service that will send and receive messages using Azure Service Bus
    /// Implements the <see cref="CloudQueueService" />
    /// </summary>
    /// <seealso cref="CloudQueueService" />
    public class ServiceBusService : CloudQueueService
    {
        /// <summary>
        /// Gets the cloud settings.
        /// </summary>
        /// <value>The cloud settings.</value>
        private CloudSettings CloudSettings { get; }

        /// <summary>
        /// Gets the service bus client.
        /// </summary>
        /// <value>The service bus client.</value>
        protected ServiceBusClient ServiceBusClient { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ServiceBusService" /> class.
        /// </summary>
        /// <param name="cloudSettings">The cloud provider settings.</param>
        /// <param name="logger">The logger.</param>
        public ServiceBusService(CloudSettings cloudSettings, ILogger<ServiceBusService> logger) : base(logger)
        {
            CloudSettings = cloudSettings;
            var connectionString = $"Endpoint={CloudSettings.AzureServiceBusEndpoint};" +
                                   $"SharedAccessKeyName={CloudSettings.AzureServiceBusAccessKeyName};" +
                                   $"SharedAccessKey={CloudSettings.AzureServiceBusAccessKeyValue};" +
                                   $"AccountName={CloudSettings.AzureAccountName}";

            ServiceBusClient = new ServiceBusClient(connectionString);
        }

        /// <summary>
        /// Sends the message into the specified cloud queue.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="queueName">Name of the queue.</param>
        /// <param name="message">The message.</param>
        /// <returns>Task.</returns>
        public override async Task SendMessage<T>(string queueName, T message)
        {
            var sender = ServiceBusClient.CreateSender(queueName);
            var jsonMessage = JsonConvert.SerializeObject(message);
            Logger.LogInformation($"Sending message to queue {queueName}: {jsonMessage}");

            var serviceBusMessage = new ServiceBusMessage(jsonMessage);
            await sender.SendMessageAsync(serviceBusMessage);
        }

        /// <summary>
        /// Waits for a new message to arrive in the specified queue, but only if it matches the specified predicate condition.
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="queueName">Name of the queue.</param>
        /// <param name="predicate">A predicate function that evaluates whether or not the message should be retrieved.</param>
        /// <param name="cancellationToken">The cancellation token that can be used by other objects or threads to receive notice of cancellation.</param>
        /// <returns>IAsyncEnumerable&lt;QueueMessage&lt;System.Nullable&lt;T&gt;&gt;&gt;.</returns>
        public override async IAsyncEnumerable<QueueMessage<T?>> WaitForMessage<T>(string queueName,
            Func<QueueMessage<T?>, bool> predicate, [EnumeratorCancellation] CancellationToken cancellationToken = default) where T : default
        {
            var receiver = ServiceBusClient.CreateReceiver(queueName, new ServiceBusReceiverOptions
            {
                ReceiveMode = ServiceBusReceiveMode.PeekLock,
            });

            Logger.LogInformation($"Listening to queue {queueName}...");

            while (!cancellationToken.IsCancellationRequested)
            {
                var messages = await receiver.ReceiveMessagesAsync(1, TimeSpan.FromSeconds(10), cancellationToken);
                foreach (var message in messages)
                {
                    var bodyString = message.Body.ToString();
                    var body = JsonConvert.DeserializeObject<T>(bodyString);
                    QueueMessage<T?> wrappedMessage = new QueueMessage<T?>
                    {
                        Body = body,
                        ReceiptHandle = message.LockToken
                    };

                    if (predicate(wrappedMessage))
                    {
                        Logger.LogInformation($"Received a message that matches the predicate from {queueName}: \n{bodyString}");

                        yield return wrappedMessage;
                        await receiver.CompleteMessageAsync(message, cancellationToken);
                    }

                    if (cancellationToken.IsCancellationRequested)
                    {
                        yield break;
                    }
                }
            }
        }
    }
}