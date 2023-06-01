using Ludikore.Revoicer.Model;

namespace Ludikore.Revoicer.Services;

public class RevoicerJob : IRevoicerJob
{
    public RevoicerJob()
    {
        SeparatedFiles = new List<string>();
        UpdatedVocals = new List<string>();
        JobId = Guid.NewGuid().ToString();
    }

    public string Name { get; set; }
    
    public string FilePath { get; set; }

    public string ContentType { get; set; }
    public string Voice { get; set; }

    public List<string> SeparatedFiles { get; set;  }
    public List<string> UpdatedVocals { get; set; }
    public string JobId { get; set; }
}