using System.Runtime.CompilerServices;
using Amazon.Runtime;
using Amazon.SQS;
using Amazon.SQS.Model;
using Ludikore.Revoicer.Services.Cloud;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Ludikore.Revoicer.Services.AWS
{
    /// <summary>
    /// This class implements a cloud queue service for Amazon SQS 
    /// Implements the <see cref="CloudQueueService" />
    /// </summary>
    /// <seealso cref="CloudQueueService" />
    public class SqsService : CloudQueueService
    {
        /// <summary>
        /// Gets the SQS client.
        /// </summary>
        /// <value>The SQS client.</value>
        protected AmazonSQSClient SqsClient { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="SqsService" /> class.
        /// </summary>
        /// <param name="serviceUrl">The service URL.</param>
        /// <param name="logger">The logger.</param>
        public SqsService(string serviceUrl, ILogger<SqsService> logger) : base(logger)
        {
            SqsClient = new AmazonSQSClient(
                new EnvironmentVariablesAWSCredentials(),
                new AmazonSQSConfig { ServiceURL = serviceUrl }
            );
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
            var getQueueUrlResponse = await SqsClient.GetQueueUrlAsync(queueName);

            var request = new SendMessageRequest
            {
                QueueUrl = getQueueUrlResponse.QueueUrl,
                MessageBody = JsonConvert.SerializeObject(message),
                MessageGroupId = Guid.NewGuid().ToString(),
                MessageDeduplicationId = Guid.NewGuid().ToString()
            };
            await SqsClient.SendMessageAsync(request);
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
            var getQueueUrlResponse = await SqsClient.GetQueueUrlAsync(queueName, cancellationToken);

            while (!cancellationToken.IsCancellationRequested)
            {
                var response = await SqsClient.ReceiveMessageAsync(new ReceiveMessageRequest
                {
                    QueueUrl = getQueueUrlResponse.QueueUrl,
                    MaxNumberOfMessages = 1,
                    WaitTimeSeconds = 10,
                    VisibilityTimeout = 5,
                }, cancellationToken);


                foreach (var message in response.Messages)
                {
                    var body = JsonConvert.DeserializeObject<T>(message.Body);
                    QueueMessage<T?> wrappedMessage = new QueueMessage<T?>()
                    {
                        Body = body,
                        ReceiptHandle = message.ReceiptHandle,
                    };

                    if (predicate(wrappedMessage))
                    {
                        yield return wrappedMessage;
                        await SqsClient.DeleteMessageAsync(new DeleteMessageRequest
                        {
                            QueueUrl = getQueueUrlResponse.QueueUrl,
                            ReceiptHandle = wrappedMessage.ReceiptHandle
                        }, cancellationToken);
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