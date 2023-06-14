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
    public class ServiceBusService : CloudQueueService
    {
        private readonly ServiceBusClient serviceBusClient;

        public ServiceBusService(string connectionString) : base()
        {
            serviceBusClient = new ServiceBusClient(connectionString);
        }

        public override async Task SendMessage<T>(string queueName, T message)
        {
            var sender = serviceBusClient.CreateSender(queueName);
            var jsonMessage = JsonConvert.SerializeObject(message);
            var serviceBusMessage = new ServiceBusMessage(jsonMessage);
            await sender.SendMessageAsync(serviceBusMessage);
        }

        public override async IAsyncEnumerable<QueueMessage<T?>> WaitForMessage<T>(string queueName,
            Func<QueueMessage<T?>, bool> predicate, [EnumeratorCancellation] CancellationToken cancellationToken = default) where T : default
        {
            var receiver = serviceBusClient.CreateReceiver(queueName, new ServiceBusReceiverOptions
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