using System.Runtime.CompilerServices;
using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.AWS;
using Ludikore.Revoicer.Services.Cloud;

namespace Ludikore.Revoicer.Services;

/// <summary>
/// This class provides the base functionality for a service that will submit jobs into a queue to be collected by a worker service.
/// </summary>
/// <typeparam name="TInput">The type of the input work item.</typeparam>
public abstract class QueueBasedService<TInput>
    where TInput : IWorkerJobData 
{
    /// <summary>
    /// Gets the queue service.
    /// </summary>
    /// <value>The queue service.</value>
    protected CloudQueueService QueueService { get; }

    /// <summary>
    /// Gets the input queue.
    /// </summary>
    /// <value>The input queue.</value>
    protected string InputQueue { get; }

    /// <summary>
    /// Initializes a new instance of the <see cref="QueueBasedService{TInput}"/> class.
    /// </summary>
    /// <param name="inputQueue">The input queue.</param>
    protected QueueBasedService(string inputQueue)
    {
        var factory = new CloudProviderFactory(CloudProvider.Azure);

        QueueService = factory.GetQueueService();
        InputQueue = inputQueue;
    }

    /// <summary>
    /// Submits the job into the queue so the workers can collect and process them.
    /// </summary>
    /// <param name="inputData">The input data.</param>
    public async Task SubmitJob(TInput inputData)
    {
        await QueueService.SendMessage(InputQueue, inputData);
    }
}
