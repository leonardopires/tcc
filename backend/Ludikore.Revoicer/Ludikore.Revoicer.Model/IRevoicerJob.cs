namespace Ludikore.Revoicer.Model
{
    public interface IRevoicerJob : IQueueJobData, IFileDescriptor
    {
        string OperationId { get; set; }
        string Voice { get; set; }

        List<string> Input { get; set; }

        List<string> Split { get; }

        List<string> Revoiced { get;  }
    }
}