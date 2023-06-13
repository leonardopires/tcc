namespace Ludikore.Revoicer.Services;

public class RevoicerService : QueueBasedService<RevoicerJob>
{
    public RevoicerService() : base("revoicer-svc-input.fifo")
    {
    }
}