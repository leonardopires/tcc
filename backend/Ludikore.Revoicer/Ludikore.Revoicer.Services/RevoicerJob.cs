using Ludikore.Revoicer.Model;

namespace Ludikore.Revoicer.Services;

/// <summary>
/// Represents a job submitted for workers in the Revoicer system.
/// Implements the <see cref="IRevoicerJob" />
/// </summary>
/// <seealso cref="IRevoicerJob" />
public class RevoicerJob : IRevoicerJob
{
    /// <summary>
    /// Initializes a new instance of the <see cref="RevoicerJob"/> class.
    /// </summary>
    public RevoicerJob()
    {
        Split = new List<string>();
        Revoiced = new List<string>();
        Input = new List<string>();
        var jobId = Guid.NewGuid().ToString();
        JobId = jobId;
        OperationId = jobId;
    }

    /// <summary>
    /// Gets or sets the file name.
    /// </summary>
    /// <value>The name.</value>
    public string Name { get; set; }

    /// <summary>
    /// Gets or sets the file path.
    /// </summary>
    /// <value>The file path.</value>
    public string FilePath { get; set; }

    /// <summary>
    /// Gets or sets the type of the content.
    /// </summary>
    /// <value>The type of the content.</value>
    public string ContentType { get; set; }

    /// <summary>
    /// Gets or sets the operation identifier.
    /// </summary>
    /// <value>The operation identifier.</value>
    public string OperationId { get; set; }

    /// <summary>
    /// Gets or sets the voice.
    /// </summary>
    /// <value>The voice.</value>
    public string Voice { get; set; }

    /// <summary>
    /// Gets or sets the input.
    /// </summary>
    /// <value>The input.</value>
    public List<string> Input { get; set; }

    /// <summary>
    /// Gets or sets the split.
    /// </summary>
    /// <value>The split.</value>
    public List<string> Split { get; set; }

    /// <summary>
    /// Gets or sets the revoiced.
    /// </summary>
    /// <value>The revoiced.</value>
    public List<string> Revoiced { get; set; }

    /// <summary>
    /// Gets or sets the job identifier.
    /// </summary>
    /// <value>The job identifier.</value>
    public string JobId { get; set; }
}