using System.Runtime.CompilerServices;
using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.AWS;

namespace Ludikore.Revoicer.Services;

public abstract class QueueBasedService<TInput, TOutput> where TInput : IQueueJobData where TOutput : IQueueJobData
{
    protected SQSFacade Sqs { get; }

    protected QueueBasedService(string inputQueue, string outputQueue)
    {
        Sqs = new SQSFacade();
        InputQueue = inputQueue;
        OutputQueue = outputQueue;
    }

    protected string InputQueue { get; }
    protected string OutputQueue { get; }
     
    public async IAsyncEnumerable<TOutput> SubmitJob(TInput inputData,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        await Sqs.SendMessage(InputQueue, inputData);

        bool Predicate(SQSMessage<TOutput?> item) => item?.Body?.JobId == inputData.JobId;

        await foreach (var message in Sqs.WaitForMessage<TOutput>(OutputQueue, Predicate, cancellationToken))
        {
            if (message.Body != null)
            {
                yield return message.Body;
            }
        }
    }
}
