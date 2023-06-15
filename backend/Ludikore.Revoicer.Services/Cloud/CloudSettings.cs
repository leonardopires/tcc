using Microsoft.Extensions.Configuration;

namespace Ludikore.Revoicer.Services.Cloud;

/// <summary>
/// This class retrieves the environment variables related to the cloud configuration and
/// exposes them in an easy to consume way
/// </summary>
public class CloudSettings
{
    public IConfiguration Configuration { get; }

    public CloudSettings(IConfiguration configuration)
    {
        Configuration = configuration;
        AzureServiceBusEndpoint = LoadSetting("AZURE_SB_ENDPOINT");
        AzureServiceBusAccessKeyName = LoadSetting("AZURE_SB_ACCESS_KEY_NAME");
        AzureServiceBusAccessKeyValue = LoadSetting("AZURE_SB_ACCESS_KEY_VALUE");
        AzureAccountName = LoadSetting("AZURE_ACCOUNT_NAME");
        AzureStorageAccessKey = LoadSetting("AZURE_STORAGE_ACCESS_KEY");
        AzureStorageContainerName = LoadSetting("AZURE_STORAGE_CONTAINER_NAME");
        AwsEndpoint = LoadSetting("AWS_ENDPOINT");
        RevoiceInputQueue = LoadSetting("REVOICE_INPUT_QUEUE");
        RevoiceOutputQueue = LoadSetting("REVOICE_OUTPUT_QUEUE");
        SplitInputQueue = LoadSetting("SPLIT_INPUT_QUEUE");
        SplitOutputQueue = LoadSetting("SPLIT_OUTPUT_QUEUE");
    }


    /// <summary>
    /// Gets the azure service bus endpoint.
    /// </summary>
    /// <value>The azure service bus endpoint.</value>
    public string AzureServiceBusEndpoint { get; }

    /// <summary>
    /// Gets the name of the azure service bus access key.
    /// </summary>
    /// <value>The name of the azure service bus access key.</value>
    public string AzureServiceBusAccessKeyName { get; }

    /// <summary>
    /// Gets the azure service bus access key value.
    /// </summary>
    /// <value>The azure service bus access key value.</value>
    public string AzureServiceBusAccessKeyValue { get; }

    /// <summary>
    /// Gets the name of the azure account.
    /// </summary>
    /// <value>The name of the azure account.</value>
    public string AzureAccountName { get; }

    /// <summary>
    /// Gets the azure storage access key.
    /// </summary>
    /// <value>The azure storage access key.</value>
    public string AzureStorageAccessKey { get; }

    /// <summary>
    /// Gets the azure storage container.
    /// </summary>
    /// <value>The azure storage container.</value>
    public string AzureStorageContainerName { get; }


    /// <summary>
    /// Gets the aws endpoint.
    /// </summary>
    /// <value>The aws endpoint.</value>
    public string AwsEndpoint { get; }

    /// <summary>
    /// Gets the revoice input queue.
    /// </summary>
    /// <value>The revoice input queue.</value>
    public string RevoiceInputQueue { get; }

    /// <summary>
    /// Gets the revoice output queue.
    /// </summary>
    /// <value>The revoice output queue.</value>
    public string RevoiceOutputQueue { get; }

    /// <summary>
    /// Gets the split input queue.
    /// </summary>
    /// <value>The split input queue.</value>
    public string SplitInputQueue { get; }

    /// <summary>
    /// Gets the split output queue.
    /// </summary>
    /// <value>The split output queue.</value>
    public string SplitOutputQueue { get; }

    /// <summary>
    /// Loads the setting with the specified name.
    /// </summary>
    /// <param name="settingName">Name of the setting.</param>
    /// <returns>System.String.</returns>
    /// <exception cref="Ludikore.Revoicer.Services.Cloud.RevoicerConfigurationNotFoundException"></exception>
    public string LoadSetting(string settingName)
    {
        var settingValue = Configuration[settingName];
        if (settingValue == null)
        {
            throw new RevoicerConfigurationNotFoundException(settingName);
        }

        return settingValue;
    }
}