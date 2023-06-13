using System.Runtime.CompilerServices;
using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.AWS;

namespace Ludikore.Revoicer.Services;

public abstract class QueueBasedService<TInput>
    where TInput : IQueueJobData 
{
    protected SQSFacade Sqs { get; }

    protected QueueBasedService(string inputQueue)
    {
        Sqs = new SQSFacade();
        InputQueue = inputQueue;
    }

    protected string InputQueue { get; }
     
    public async Task SubmitJob(TInput inputData)
    {
        await Sqs.SendMessage(InputQueue, inputData);
    }
}
