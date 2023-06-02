using Ludikore.Revoicer.Model;

namespace Ludikore.Revoicer.Services;

public class RevoicerJob : IRevoicerJob
{
    public RevoicerJob()
    {
        Split = new List<string>();
        Revoiced = new List<string>();
        Input = new List<string>();
        var jobId = Guid.NewGuid().ToString();
        JobId = jobId;
        OperationId = jobId;
    }

    public string Name { get; set; }
    
    public string FilePath { get; set; }

    public string ContentType { get; set; }
    public string OperationId { get; set; }
    public string Voice { get; set; }
    public List<string> Input { get; set; }

    public List<string> Split { get; set;  }
    public List<string> Revoiced { get; set; }
    public string JobId { get; set; }
}