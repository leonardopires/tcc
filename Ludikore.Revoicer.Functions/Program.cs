using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
  .ConfigureFunctionsWorkerDefaults()
  .ConfigureAppConfiguration(c => c.AddJsonFile("local.settings.json").AddEnvironmentVariables(prefix: "REVOICER_"))
  .ConfigureServices(s =>
  {
    s.AddLogging();
  })
  .Build();

host.Run();
