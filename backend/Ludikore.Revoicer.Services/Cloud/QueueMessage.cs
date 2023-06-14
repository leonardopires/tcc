namespace Ludikore.Revoicer.Services.Cloud;

/// <summary>
/// Represents a message submitted into a cloud queue
/// </summary>
/// <typeparam name="T"></typeparam>
public class QueueMessage<T>
{
    /// <summary>
    /// Gets or sets the body.
    /// </summary>
    /// <value>The body.</value>
    public T Body { get; set; }

    /// <summary>
    /// Gets or sets the receipt handle.
    /// </summary>
    /// <value>The receipt handle.</value>
    public string ReceiptHandle { get; set; }
}