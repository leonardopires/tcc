namespace Ludikore.Revoicer.Model
{
    public interface IRevoicerJob : IQueueJobData, IFileDescriptor
    {
        string Voice { get; set; }

        List<string> SeparatedFiles { get; }

        List<string> UpdatedVocals { get;  }
    }
}