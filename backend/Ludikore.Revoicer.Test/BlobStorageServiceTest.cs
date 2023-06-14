using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ludikore.Revoicer.Model;
using Ludikore.Revoicer.Services.Cloud;

namespace Ludikore.Revoicer.Test
{
    /// <summary>
    /// Tests the <see cref="BlobStorageService"/> class.
    /// </summary>
    public class BlobStorageServiceTest
    {
        [Fact]
        public async Task GenerateUrl()
        {
            // Arrange
            var factory = new CloudProviderFactory(CloudProvider.Azure);
            var subject = factory.GetStorageService();
            var expected = "TheCranberriesDreams1994.mp3";

            // Act
            var actual = await subject.GetFileUrl("revoicer",
                new FileDescriptor(expected, "audio/mpeg", "test"));


            // Assert
            Assert.Contains("https://revoicer.blob.core.windows.net/revoicer/test%5CTheCranberriesDreams1994.mp3?", actual);
        }
    }
}
