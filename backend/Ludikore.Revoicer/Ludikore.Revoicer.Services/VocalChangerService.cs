namespace Ludikore.Revoicer.Services;

public class VocalChangerService : QueueBasedService<RevoicerJob, RevoicerJob>
{
    public VocalChangerService() : base("revoicer-svc-input.fifo", "revoicer-svc-output.fifo")
    {
    }
}