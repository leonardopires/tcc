using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using Azure.Messaging.ServiceBus;
using Ludikore.Revoicer.Services.Cloud;
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
        /// Gets the service bus client.
        /// </summary>
        /// <value>The service bus client.</value>
        protected ServiceBusClient ServiceBusClient { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ServiceBusService"/> class.
        /// </summary>
        /// <param name="connectionString">The connection string.</param>
        public ServiceBusService(string connectionString) : base()
        {
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

            while (!cancellationToken.IsCancellationRequested)
            {
                var messages = await receiver.ReceiveMessagesAsync(1, TimeSpan.FromSeconds(10), cancellationToken);
                foreach (var message in messages)
                {
                    var body = JsonConvert.DeserializeObject<T>(message.Body.ToString());
                    QueueMessage<T?> wrappedMessage = new QueueMessage<T?>
                    {
                        Body = body,
                        ReceiptHandle = message.LockToken
                    };

                    if (predicate(wrappedMessage))
                    {
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