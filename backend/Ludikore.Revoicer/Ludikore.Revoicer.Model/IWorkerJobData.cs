namespace Ludikore.Revoicer.Model;

/// <summary>
/// Represents a job submitted to a worker queue
/// </summary>
public interface IWorkerJobData
{
    /// <summary>
    /// Gets or sets the job identifier.
    /// </summary>
    /// <value>The job identifier.</value>
    string JobId { get; set;  }
}