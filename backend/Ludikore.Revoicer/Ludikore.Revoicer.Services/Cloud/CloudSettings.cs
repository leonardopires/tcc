namespace Ludikore.Revoicer.Services.Cloud;

/// <summary>
/// This class retrieves the environment variables related to the cloud configuration and
/// exposes them in an easy to consume way
/// </summary>
public static class CloudSettings
{
    /// <summary>
    /// Gets the azure service bus endpoint.
    /// </summary>
    /// <value>The azure service bus endpoint.</value>
    public static string AzureServiceBusEndpoint { get; } = LoadSetting("AZURE_SB_ENDPOINT");

    /// <summary>
    /// Gets the name of the azure service bus access key.
    /// </summary>
    /// <value>The name of the azure service bus access key.</value>
    public static string AzureServiceBusAccessKeyName { get; } = LoadSetting("AZURE_SB_ACCESS_KEY_NAME");

    /// <summary>
    /// Gets the azure service bus access key value.
    /// </summary>
    /// <value>The azure service bus access key value.</value>
    public static string AzureServiceBusAccessKeyValue { get; } = LoadSetting("AZURE_SB_ACCESS_KEY_VALUE");

    /// <summary>
    /// Gets the name of the azure account.
    /// </summary>
    /// <value>The name of the azure account.</value>
    public static string AzureAccountName { get; } = LoadSetting("AZURE_ACCOUNT_NAME");

    /// <summary>
    /// Gets the azure storage access key.
    /// </summary>
    /// <value>The azure storage access key.</value>
    public static string AzureStorageAccessKey { get; } = LoadSetting("AZURE_STORAGE_ACCESS_KEY");

    /// <summary>
    /// Gets the aws endpoint.
    /// </summary>
    /// <value>The aws endpoint.</value>
    public static string AwsEndpoint { get; } = LoadSetting("AWS_ENDPOINT");

    /// <summary>
    /// Loads the setting with the specified name.
    /// </summary>
    /// <param name="settingName">Name of the setting.</param>
    /// <returns>System.String.</returns>
    /// <exception cref="Ludikore.Revoicer.Services.Cloud.RevoicerConfigurationNotFoundException"></exception>
    public static string LoadSetting(string settingName)
    {
        var settingValue = Environment.GetEnvironmentVariable(settingName);
        if (settingValue == null)
        {
            throw new RevoicerConfigurationNotFoundException(settingName);
        }

        return settingValue;
    }
}