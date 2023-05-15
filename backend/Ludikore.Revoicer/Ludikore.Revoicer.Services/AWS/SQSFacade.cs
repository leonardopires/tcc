using System;
using System.Collections.Generic;
using System.Linq;
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
    internal class SQSFacade
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
            
            var request = new SendMessageRequest {
                QueueUrl = getQueueUrlResponse.QueueUrl,
                MessageBody = JsonConvert.SerializeObject(message)
            };
            await sqs.SendMessageAsync(request);
        }
    }
}