namespace Ludikore.Revoicer.Services.Cloud;

/// <summary>
/// The base class for exceptions caused by the Revoicer application
/// Implements the <see cref="System.ApplicationException" />
/// </summary>
/// <seealso cref="System.ApplicationException" />
public abstract class RevoicerException : ApplicationException
{
    /// <summary>
    /// Initializes a new instance of the <see cref="RevoicerException"/> class.
    /// </summary>
    /// <param name="message">A message that describes the error.</param>
    protected RevoicerException(string message) : base(message)
    {

    }

    /// <summary>
    /// Initializes a new instance of the <see cref="RevoicerException"/> class.
    /// </summary>
    /// <param name="message">The error message that explains the reason for the exception.</param>
    /// <param name="innerException">The exception that is the cause of the current exception. If the <paramref name="innerException" /> parameter is not a null reference, the current exception is raised in a <see langword="catch" /> block that handles the inner exception.</param>
    protected RevoicerException(string message, Exception innerException) : base(message, innerException)
    {

    }
}