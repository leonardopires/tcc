using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Ludikore.Revoicer.Services.IO
{
    /// <summary>
    /// This class provides useful functionality for processing file names
    /// </summary>
    public class FileNameFormatter
    {
        /// <summary>
        /// Sanitizes the specified filename, removing any unsupported or dangerous characters..
        /// </summary>
        /// <param name="fileName">Name of the file.</param>
        /// <returns>System.String.</returns>
        public string SanitizeFileName(string fileName)
        {
            var extension = Path.GetExtension(fileName);
            var extensionlessName = Path.GetFileNameWithoutExtension(fileName);
            var sanitizedName = Regex.Replace(extensionlessName, "[^A-Z|a-z|0-9]+", string.Empty);

            if (string.IsNullOrWhiteSpace(sanitizedName))
            {
                sanitizedName = Guid.NewGuid().ToString();
            }

            var actualName = Path.ChangeExtension(sanitizedName, extension);
            return actualName;
        }

        /// <summary>
        /// Removes the root folder (leading /) from a given file path.
        /// </summary>
        /// <param name="filePath">The file path.</param>
        /// <returns>System.String.</returns>
        public string RemoveRootFolderFromPath(string filePath)
        {
            if (filePath.StartsWith("/"))
            {
                filePath = filePath.Substring(1);
            }

            return filePath;
        }
    }
}
