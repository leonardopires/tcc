namespace Ludikore.Revoicer.Model
{
    public interface IRevoicerJob : IWorkerJobData, IFileDescriptor
    {
        string OperationId { get; set; }
        string Voice { get; set; }

        List<string> Input { get; set; }

        List<string> Split { get; }

        List<string> Revoiced { get;  }
    }
}