﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ludikore.Revoicer.Services
{
    public class SplitterService : QueueBasedService<RevoicerJob>
    {
        public SplitterService() : base("revoicer-demucs-input.fifo")
        {
        }
    }
}
