using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ludikore.Revoicer.Services.AWS;
using Ludikore.Revoicer.Services.Azure;

namespace Ludikore.Revoicer.Services.Cloud
{
    public class CloudProviderFactory
    {
        public CloudProvider Provider { get; }

        public CloudProviderFactory(CloudProvider provider)
        {
            Provider = provider;
        }

        public CloudQueueService GetQueueService()
        {
            switch (Provider)
            {
                case CloudProvider.AWS:
                    return new SqsService("http://localstack:4566");
                case CloudProvider.Azure:
                    return new ServiceBusService("Endpoint=sb://revoicer.servicebus.windows.net/;" +
                                                "SharedAccessKeyName=RootManageSharedAccessKey;" +
                                                "SharedAccessKey=r62Vegf/HS2iKV6MJHaDprhNC6KSe/7jH+ASbAH7Sbc=;" +
                                                "AccountName=revoicer");
                default:
                    throw new ArgumentOutOfRangeException($"There is no entry for this cloud provider: {Provider}");
            }
        }

        public CloudStorageService GetStorageService()
        {
            switch (Provider)
            {
                case CloudProvider.AWS:
                    return new S3Service("http://localstack:4566");
                case CloudProvider.Azure:
                    return new BlobStorageService(
                        connectionString: "DefaultEndpointsProtocol=https;" +
                                          "AccountName=revoicer;" +
                                          "AccountKey=0V+Dn/QnQ7tRSwaevHymXGtR/UgstoMITdhotUxGRtPDc5/wz+wj7QmQpHqWxP+N7eUI5LzHlwIp+AStdfhaKg==;" +
                                          "EndpointSuffix=core.windows.net",
                        sasAccountKey:
                        "0V+Dn/QnQ7tRSwaevHymXGtR/UgstoMITdhotUxGRtPDc5/wz+wj7QmQpHqWxP+N7eUI5LzHlwIp+AStdfhaKg==");
                default:
                    throw new ArgumentOutOfRangeException($"There is no entry for this cloud provider: {Provider}");
            }
        }
    }
}