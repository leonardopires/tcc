using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Ludikore.Revoicer.Services.IO
{
    public class FileNameFormatter
    {
        public string SanitizeFileName(string fileName)
        {
            var extension = Path.GetExtension(fileName);
            var extensionlessName = Path.GetFileNameWithoutExtension(fileName);
            var sanitizedName = Regex.Replace(extensionlessName, "[^A-Z|a-z|0-9]+", string.Empty);
            var actualName = Path.ChangeExtension(sanitizedName, extension);
            return actualName;
        }

        public string RemoveRootFolderName(string filePath)
        {
            if (filePath.StartsWith("/"))
            {
                filePath = filePath.Substring(1);
            }

            return filePath;
        }
    }
}
