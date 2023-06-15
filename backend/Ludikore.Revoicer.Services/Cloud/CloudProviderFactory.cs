using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ludikore.Revoicer.Services.AWS;
using Ludikore.Revoicer.Services.Azure;
using Microsoft.Extensions.Configuration;

namespace Ludikore.Revoicer.Services.Cloud
{
    /// <summary>
    /// This class returns preconfigured instances of the cloud services for the cloud provider specified on its initialization
    /// </summary>
    public class CloudProviderFactory
    {


        /// <summary>
        /// Gets the cloud provider being used.
        /// </summary>
        /// <value>The cloud provider.</value>
        public CloudProvider Provider { get; }

        public CloudSettings CloudSettings { get; }

        /// <summary>
        /// Initializes a new instance of the <see cref="CloudProviderFactory" /> class.
        /// </summary>
        /// <param name="provider">The provider.</param>
        /// <param name="configuration"></param>
        /// <param name="cloudSettings">The settings.</param>
        public CloudProviderFactory(CloudProvider provider, IConfiguration configuration)
        {
            Provider = provider;
            CloudSettings = new CloudSettings(configuration);
        }

        /// <summary>
        /// Creates or retrieves an instance of the service that provides access to message queues
        /// </summary>
        /// <returns>CloudQueueService.</returns>
        /// <exception cref="Ludikore.Revoicer.Services.Cloud.RevoicerConfigurationException">There is no entry for this cloud provider: {Provider}</exception>
        public CloudQueueService GetQueueService()
        {
            switch (Provider)
            {
                case CloudProvider.AWS:
                    return new SqsService(CloudSettings.AwsEndpoint);
                case CloudProvider.Azure:
                    var queueConnectionString = $"Endpoint={CloudSettings.AzureServiceBusEndpoint};" +
                                                $"SharedAccessKeyName={CloudSettings.AzureServiceBusAccessKeyName};" +
                                                $"SharedAccessKey={CloudSettings.AzureServiceBusAccessKeyValue};" +
                                                $"AccountName={CloudSettings.AzureAccountName}";

                    return new ServiceBusService(queueConnectionString);
                default:
                    throw new RevoicerConfigurationException($"There is no entry for this cloud provider: {Provider}");
            }
        }

        /// <summary>
        /// Creates or retrieves an instance of the service that provides access to the cloud storage
        /// </summary>
        /// <returns>CloudStorageService.</returns>
        /// <exception cref="Ludikore.Revoicer.Services.Cloud.RevoicerConfigurationException">There is no entry for this cloud provider: {Provider}</exception>
        public CloudStorageService GetStorageService()
        {
            switch (Provider)
            {
                case CloudProvider.AWS:
                    return new S3Service("http://localstack:4566");
                case CloudProvider.Azure:

                    var storageConnectionString = "DefaultEndpointsProtocol=https;" +
                                                  $"AccountName={CloudSettings.AzureAccountName};" +
                                                  $"AccountKey={CloudSettings.AzureStorageAccessKey};" +
                                                  "EndpointSuffix=core.windows.net";

                    return new BlobStorageService(
                        connectionString: storageConnectionString,
                        sasAccountKey: CloudSettings.AzureStorageAccessKey);
                default:
                    throw new RevoicerConfigurationException($"There is no entry for this cloud provider: {Provider}");
            }
        }
    }
}