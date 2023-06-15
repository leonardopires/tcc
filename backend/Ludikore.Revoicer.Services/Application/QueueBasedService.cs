using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.Cloud;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Ludikore.Revoicer.Services.Application;

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
    /// Initializes a new instance of the <see cref="QueueBasedService{TInput}" /> class.
    /// </summary>
    /// <param name="inputQueue">The input queue.</param>
    /// <param name="queueService">The queue service.</param>
    /// <param name="logger">The logger.</param>
    protected QueueBasedService(string inputQueue, CloudQueueService queueService, ILogger<QueueBasedService<TInput>> logger)
    {
        QueueService = queueService;
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
