using Microsoft.Extensions.Logging;

namespace Ludikore.Revoicer.Services.Cloud;

public abstract class CloudQueueService
{
    /// <summary>
    /// Gets the logger.
    /// </summary>
    /// <value>The logger.</value>
    protected ILogger<CloudQueueService> Logger { get; }

    /// <summary>
    /// Initializes a new instance of the <see cref="CloudQueueService"/> class.
    /// </summary>
    /// <param name="logger">The logger.</param>
    protected CloudQueueService(ILogger<CloudQueueService> logger)
    {
        Logger = logger;
    }

    /// <summary>
    /// Sends the message into the specified cloud queue.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="queueName">Name of the queue.</param>
    /// <param name="message">The message.</param>
    /// <returns>Task.</returns>
    public abstract Task SendMessage<T>(string queueName, T message);

    /// <summary>
    /// Waits for a new message to arrive in the specified queue, but only if it matches the specified predicate condition.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="queueName">Name of the queue.</param>
    /// <param name="predicate">A predicate function that evaluates whether or not the message should be retrieved.</param>
    /// <param name="cancellationToken">The cancellation token that can be used by other objects or threads to receive notice of cancellation.</param>
    /// <returns>IAsyncEnumerable&lt;QueueMessage&lt;System.Nullable&lt;T&gt;&gt;&gt;.</returns>
    public abstract IAsyncEnumerable<QueueMessage<T?>> WaitForMessage<T>(string queueName,
        Func<QueueMessage<T?>, bool> predicate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Waits for a new message to arrive in the specified queue.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="queueName">Name of the queue.</param>
    /// <param name="cancellationToken">The cancellation token that can be used by other objects or threads to receive notice of cancellation.</param>
    /// <returns>IAsyncEnumerable&lt;QueueMessage&lt;System.Nullable&lt;T&gt;&gt;&gt;.</returns>
    public virtual IAsyncEnumerable<QueueMessage<T?>> WaitForMessage<T>(string queueName,
        CancellationToken cancellationToken = default)
    {
        return WaitForMessage<T>(queueName, (_) => true, cancellationToken);
    }
}