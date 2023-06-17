using System.Diagnostics;
using Ludikore.Revoicer.Services.Cloud;
using Microsoft.Extensions.FileProviders;

namespace Ludikore.Revoicer.Web.Extensions
{
  /// <summary>
  /// Class WebAppExtensions.
  /// </summary>
  public static class WebAppExtensions
  {
    private static Process Npm { get; } = new();

    /// <summary>
    /// Uses the React development server middleware in the pipeline.
    /// </summary>
    /// <param name="app">The web application.</param>
    /// <param name="port">The port number to use.</param>
    /// <param name="npmArgs">Additional arguments to pass to npm.</param>
    /// <returns>The updated web application.</returns>
    public static async Task UseReactDevServer(this WebApplication app, int port, params string[] npmArgs)
    {
      var npmArgsList = npmArgs.ToList();

      if (npmArgsList.Count == 0)
      {
        npmArgsList.Add("start");
      }

      app.UseSpa(spa =>
      {
        spa.Options.SourcePath = "./ClientApp";
        spa.Options.DefaultPage = new PathString("/index.html");
        spa.Options.DefaultPageStaticFileOptions = new StaticFileOptions
        {
          FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "ClientApp")),
        };
        spa.UseProxyToSpaDevelopmentServer($"http://localhost:{port}");
      });


      var logger = app.Services.GetRequiredService<ILogger<Program>>();


      await Task.Run(async () =>
      {
        try
        {
          CleanNodeProcesses(logger);

          var existingNodeProcesses = GetNodeProcesses(logger);

          if (existingNodeProcesses.Length == 0)
          {
            await StartNpm(port, npmArgsList, logger);
          }
          else
          {
            logger.LogInformation("[NPM] Node is already running. Skipping initialization.");
          }
        }
        catch (Exception e)
        {
          logger.LogError(e, "[NPM] Error while waiting for NPM to exit");
        }
      });
    }

    /// <summary>
    /// Starts the npm task asynchronously with the specified port, npm arguments and logger.
    /// </summary>
    /// <param name="port">The port number.</param>
    /// <param name="npmArgsList">The list of npm arguments.</param>
    /// <param name="logger">The logger.</param>
    /// <returns>A Task representing the asynchronous operation.</returns>
    private static async Task StartNpm(int port, List<string> npmArgsList, ILogger<Program> logger)
    {
      Npm.StartInfo = new ProcessStartInfo
      {
        FileName = Environment.ExpandEnvironmentVariables("node"),
        Arguments = $"--max_old_space_size=8000 --no-warnings --trace-deprecation /usr/bin/npm run {string.Join(" ", npmArgsList)}",
        WorkingDirectory = "./ClientApp",
        UseShellExecute = false,
        RedirectStandardOutput = true,
        RedirectStandardError = true,
        CreateNoWindow = true,
        Environment =
        {
          ["PORT"] = port.ToString(),
          ["BROWSER"] = "none",
          ["NODE_ENV"] = "development",
        },
      };


      Npm.ErrorDataReceived += (sender, args) =>
      {
        if (args.Data != null) logger.LogError("[NPM] {ArgsData}", args.Data);
      };

      Npm.OutputDataReceived += (sender, args) =>
      {
        if (args.Data != null) logger.LogInformation("[NPM] {ArgsData}", args.Data);
      };


      Npm.Exited += (sender, args) => logger.LogWarning(
        "[NPM] Process completed. Exit code: {ExitCode}. Time: {ExitTime}", Npm.ExitCode, Npm.ExitTime);

      var startInfo = Npm.StartInfo;

      logger.LogInformation("Starting process: {StartInfoFileName} {StartInfoArguments}",
        startInfo.FileName,
        string.Join(" ", startInfo.Arguments));

      if (!Npm.Start())
      {
        throw new RevoicerConfigurationException(
          $"Unable to start npm with arguments: {startInfo.FileName} {startInfo.Arguments}");
      }

      Npm.BeginOutputReadLine();
      Npm.BeginErrorReadLine();

      await Npm.WaitForExitAsync();
    }

    /// <summary>
    /// Kills all node or npm processes.
    /// </summary>
    /// <param name="logger">An instance of ILogger to log messages.</param>
    private static void CleanNodeProcesses(ILogger<Program> logger)
    {
      if (!Environment.GetCommandLineArgs().Contains("--clean")) return;


      var existingNodeProcesses = GetNodeProcesses(logger);
      logger.LogInformation("[NPM] Killing any existing node processes...");

      existingNodeProcesses.AsParallel().ForAll(nodeProcess =>
      {
        logger.LogInformation("[NPM] Killing node process with PID {PID}", nodeProcess.Id);

        try
        {
          nodeProcess.Kill();
        }
        catch (Exception e)
        {
          logger.LogError(e, "[NPM] Error while killing existing node processes");
        }
      });
    }

    /// <summary>
    /// Gets an array of all currently running processes with the name "node" or "npm".
    /// </summary>
    /// <param name="logger">An instance of the ILogger interface used for logging.</param>
    /// <returns>An array of Process objects representing the running node.js processes.</returns>
    private static Process[] GetNodeProcesses(ILogger logger)
    {
      var nodeProcesses = Process.GetProcessesByName("node")
        .AsParallel().Where(n => File.ReadAllText($"/proc/{n.Id}/cmdline").Contains("react-scripts/scripts/start.js"))
        .ToArray();
      
      if (nodeProcesses.Length > 0)
      {
        var processes = nodeProcesses.Select(p => p.ProcessName).StringJoin(", ");
        logger.LogInformation("[NPM] Found {Count} node processes running: \n {Processes}", nodeProcesses.Length, processes);
      }

      return nodeProcesses;
    }

    private static string StringJoin(this IEnumerable<string> enumerable, string separator)
      => string.Join(separator, enumerable);
  }
}