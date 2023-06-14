using System.Runtime.CompilerServices;
using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.AWS;
using Ludikore.Revoicer.Services.Cloud;

namespace Ludikore.Revoicer.Services;

public abstract class QueueBasedService<TInput>
    where TInput : IQueueJobData 
{
    protected CloudQueueService QueueService { get; }

    protected QueueBasedService(string inputQueue)
    {
        var factory = new CloudProviderFactory(CloudProvider.Azure);

        QueueService = factory.GetQueueService();
        InputQueue = inputQueue;
    }

    protected string InputQueue { get; }
     
    public async Task SubmitJob(TInput inputData)
    {
        await QueueService.SendMessage(InputQueue, inputData);
    }
}
