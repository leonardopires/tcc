using System.Runtime.CompilerServices;
using Amazon.Runtime;
using Amazon.SQS;

namespace Ludikore.Revoicer.Services.Cloud;

public abstract class CloudQueueService
{
    public abstract Task SendMessage<T>(string queueName, T message);

    public abstract IAsyncEnumerable<QueueMessage<T?>> WaitForMessage<T>(string queueName,
        Func<QueueMessage<T?>, bool> predicate, CancellationToken cancellationToken = default);

    /// <summary>
    /// Waits for message.
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