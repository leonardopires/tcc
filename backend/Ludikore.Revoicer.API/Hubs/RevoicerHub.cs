using System.Runtime.CompilerServices;
using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace Ludikore.Revoicer.API.Hubs
{
    /// <summary>
    /// This is the SignalR hub that enables communication through WebSockets
    /// Implements the <see cref="Hub" />
    /// </summary>
    /// <seealso cref="Hub" />
    public class RevoicerHub : Hub
    {
        /// <summary>
        /// Submits the song to be split into multiple channels by our worker services.
        /// </summary>
        /// <param name="song">The song.</param>
        public async Task SplitSong(RevoicerJob song)
        {
            song.JobId = this.Context.ConnectionId;
            var service = new SplitterService();

            await service.SubmitJob(song);
        }

        /// <summary>
        /// Submits the song to have its singer voice changed by our worker services.
        /// </summary>
        /// <param name="song">The song.</param>
        public async Task RevoiceSong(RevoicerJob song)
        {
            song.JobId = this.Context.ConnectionId;
            var service = new RevoicerService();

            await service.SubmitJob(song);
        }
    }
}
