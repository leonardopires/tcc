using System;
using Ludikore.Revoicer.Model;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Ludikore.Revoicer.Functions;

public static class RevoicerFunctions
{
  [Function("SplitOutputListener")]
  [SignalROutput(HubName = "revoicer", ConnectionStringSetting = "AzureSignalRConnectionString")]
  public static SignalRMessageAction Run(
    [ServiceBusTrigger(RevoicerConfig.SplitOutputQueue, Connection = "ServiceBusConnectionString")]
    string messageBody,
    FunctionContext context
  )
  {
    var logger = context.GetLogger("RevoicerFunctions");

    logger.LogInformation($"C# ServiceBus queue trigger function processed message: {messageBody}");
    var job = JsonConvert.DeserializeObject<RevoicerJob>(messageBody);

    if (job == null)
    {
      throw new FunctionWorkerException("Could not deserialize message body");
    }

    return new SignalRMessageAction("SplitComplete")
    {
      ConnectionId = job.JobId,
      Arguments = new object[] { job }
    };
  }
}