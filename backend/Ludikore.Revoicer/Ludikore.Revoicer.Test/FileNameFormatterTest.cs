
using Ludikore.Revoicer.Services.IO;

namespace Ludikore.Revoicer.Test
{
    public class FileNameFormatterTest
    {
        [Fact]
        public void SanitizeFileNameTest()
        {
            // Arrange
            var formatter = new FileNameFormatter();
            var fileName = "/data/input/Cranberries - Linger [1994].mp3";
            var expected = "CranberriesLinger1994.mp3";

            // Act
            var result = formatter.SanitizeFileName(fileName);


            // Assert
            Assert.Equal(expected, result);
        }
    }
}