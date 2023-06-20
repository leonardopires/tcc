namespace Ludikore.Revoicer.Functions;

public class RevoicerConfig
{
#if DEBUG
  public const string QueueSuffix = "fifo";
#else
  public const string QueueSuffix = "prod";
#endif
  
  public const string SplitInputQueue = "revoicer-demucs-input." + QueueSuffix;
  public const string SplitOutputQueue = "revoicer-demucs-output." + QueueSuffix;
  public const string RevoiceInputQueue = "revoicer-svc-input." + QueueSuffix;
  public const string RevoiceOutputQueue = "revoicer-svc-output." + QueueSuffix;}