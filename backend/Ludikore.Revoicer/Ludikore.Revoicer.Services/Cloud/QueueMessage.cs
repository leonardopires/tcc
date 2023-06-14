namespace Ludikore.Revoicer.Services.Cloud;

public class QueueMessage<T>
{
    public T Body { get; set; }
    public string ReceiptHandle { get; set; }
}