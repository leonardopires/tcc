using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ludikore.Revoicer.Services
{
    /// <summary>
    /// Submits jobs for the splitter (demucs) worker.
    /// Implements the <see cref="Ludikore.Revoicer.Services.QueueBasedService{Ludikore.Revoicer.Services.RevoicerJob}" />
    /// </summary>
    /// <seealso cref="Ludikore.Revoicer.Services.QueueBasedService{Ludikore.Revoicer.Services.RevoicerJob}" />
    public class SplitterService : QueueBasedService<RevoicerJob>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SplitterService"/> class.
        /// </summary>
        public SplitterService() : base("revoicer-demucs-input.fifo")
        {
        }
    }
}
