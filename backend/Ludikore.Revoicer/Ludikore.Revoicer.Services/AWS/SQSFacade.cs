using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Amazon.Runtime;
using Amazon.SQS;
using Amazon.SQS.Model;
using Newtonsoft.Json;

namespace Ludikore.Revoicer.Services.AWS
{
    public class SQSFacade
    {
        private readonly AmazonSQSClient sqs;

        public SQSFacade()
        {
            sqs = new AmazonSQSClient(
                new EnvironmentVariablesAWSCredentials(),
                new AmazonSQSConfig { ServiceURL = "http://localstack:4566" }
            );
        }

        public async Task SendMessage<T>(string queueName, T message)
        {
            var getQueueUrlResponse = await sqs.GetQueueUrlAsync(queueName);

            var request = new SendMessageRequest
            {
                QueueUrl = getQueueUrlResponse.QueueUrl,
                MessageBody = JsonConvert.SerializeObject(message),
                MessageGroupId = Guid.NewGuid().ToString(),
                MessageDeduplicationId = Guid.NewGuid().ToString()
            };
            await sqs.SendMessageAsync(request);
        }

        public async IAsyncEnumerable<SQSMessage<T?>> WaitForMessage<T>(string queueName,
            Func<SQSMessage<T?>, bool> predicate, [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            var getQueueUrlResponse = await sqs.GetQueueUrlAsync(queueName, cancellationToken);

            while (!cancellationToken.IsCancellationRequested)
            {
                var response = await sqs.ReceiveMessageAsync(new ReceiveMessageRequest
                {
                    QueueUrl = getQueueUrlResponse.QueueUrl,
                    MaxNumberOfMessages = 1,
                    WaitTimeSeconds = 10,
                    VisibilityTimeout = 5,
                }, cancellationToken);


                foreach (var message in response.Messages)
                {
                    var body = JsonConvert.DeserializeObject<T>(message.Body);
                    SQSMessage<T?> wrappedMessage = new SQSMessage<T?>()
                    {
                        Body = body,
                        ReceiptHandle = message.ReceiptHandle,
                    };

                    if (predicate(wrappedMessage))
                    {
                        yield return wrappedMessage;
                        await sqs.DeleteMessageAsync(new DeleteMessageRequest
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

    public class SQSMessage<T>
    {
        public T Body { get; set; }
        public string ReceiptHandle { get; set; }
    }
}