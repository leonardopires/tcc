using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Amazon.Runtime.Internal.Util;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Ludikore.Revoicer.Services
{
    /// <summary>
    /// Submits jobs for the splitter (demucs) worker.
    /// Implements the <see cref="RevoicerJob" />
    /// </summary>
    /// <seealso cref="RevoicerJob" />
    public class SplitterService : QueueBasedService<RevoicerJob>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="SplitterService"/> class.
        /// </summary>
        public SplitterService(IConfiguration configuration, ILogger<SplitterService> logger) : base("revoicer-demucs-input.fifo", configuration, logger)
        {
        }
    }
}
