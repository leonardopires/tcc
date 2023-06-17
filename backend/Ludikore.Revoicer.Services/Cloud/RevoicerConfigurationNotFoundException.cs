using System;

namespace Ludikore.Revoicer.Services.Cloud;

/// <summary>
/// Indicates that a configuration error happened in the application
/// Implements the <see cref="System.ApplicationException" />
/// </summary>
/// <seealso cref="System.ApplicationException" />
[Serializable]
public class RevoicerConfigurationNotFoundException : RevoicerConfigurationException
{
    /// <summary>
    /// Initializes a new instance of the <see cref="RevoicerConfigurationNotFoundException" /> class.
    /// </summary>
    /// <param name="setting">The setting that caused the issue.</param>
    public RevoicerConfigurationNotFoundException(string setting) : base($"Unable to find a valid value for setting \"{setting}\"")
    {
            
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="RevoicerConfigurationNotFoundException"/> class.
    /// </summary>
    /// <param name="setting">The setting that caused the issue.</param>
    /// <param name="innerException">The exception that is the cause of the current exception. If the <paramref name="innerException" /> parameter is not a null reference, the current exception is raised in a <see langword="catch" /> block that handles the inner exception.</param>
    public RevoicerConfigurationNotFoundException(string setting, Exception innerException) : base($"Unable to find a valid value for setting \"{setting}\"", innerException)
    {

    }
}