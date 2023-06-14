namespace Ludikore.Revoicer.Services;

/// <summary>
/// Submits jobs for the Revoicer (SVC) worker.
/// Implements the <see cref="Ludikore.Revoicer.Services.QueueBasedService{Ludikore.Revoicer.Services.RevoicerJob}" />
/// </summary>
/// <seealso cref="Ludikore.Revoicer.Services.QueueBasedService{Ludikore.Revoicer.Services.RevoicerJob}" />
public class RevoicerService : QueueBasedService<RevoicerJob>
{
    /// <summary>
    /// Initializes a new instance of the <see cref="RevoicerService"/> class.
    /// </summary>
    public RevoicerService() : base("revoicer-svc-input.fifo")
    {
    }
}