using Ludikore.Revoicer.Services.IO;

namespace Ludikore.Revoicer.Test
{
    /// <summary>
    /// Unit test for the <see cref="FileNameFormatter"/> class
    /// </summary>
    public class FileNameFormatterTest
    {
        [Theory(DisplayName = "Ensures that the SanitizeFileName method returns sanitized values")]
        [MemberData(nameof(TestValuesForEnsureSanitizeFileNameReturnsSanitizedValues))]
        public void EnsureSanitizeFileNameReturnsSanitizedValues(string input, string expected)
        {
            // Arrange
            var formatter = new FileNameFormatter();

            // Act
            var result = formatter.SanitizeFileName(input);


            // Assert
            Assert.Equal(expected, result);
        }

        public static IEnumerable<object[]> TestValuesForEnsureSanitizeFileNameReturnsSanitizedValues = new[]
        {
            new[] { "/data/input/Cranberries - Linger [1994].mp3", "CranberriesLinger1994.mp3" },
            new[] { "/data/input/deadbeef15badf00d/Cranberries - Linger {1994.mp3", "CranberriesLinger1994.mp3" },
        };
    }
}