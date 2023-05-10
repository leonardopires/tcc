using System.Runtime.CompilerServices;
using Microsoft.AspNetCore.SignalR;

namespace Ludikore.Revoicer.API.Hubs
{
    public class RevoicerHub : Hub
    {
        public async IAsyncEnumerable<DateTime> Streaming([EnumeratorCancellation] CancellationToken cancellationToken)
        {
            while (true)
            {
                yield return DateTime.UtcNow;
                await Task.Delay(1000, cancellationToken);
            }
        }
    }
}
