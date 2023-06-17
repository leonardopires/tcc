using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Mvc;

namespace Ludikore.Revoicer.Web.Controllers
{
    /// <summary>
    /// Class OidcConfigurationController.
    /// Implements the <see cref="Controller" />
    /// </summary>
    /// <seealso cref="Controller" />
    public class OidcConfigurationController : Controller
    {
        private readonly ILogger<OidcConfigurationController> _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="OidcConfigurationController"/> class.
        /// </summary>
        /// <param name="clientRequestParametersProvider">The client request parameters provider.</param>
        /// <param name="logger">The logger.</param>
        public OidcConfigurationController(
            IClientRequestParametersProvider clientRequestParametersProvider,
            ILogger<OidcConfigurationController> logger)
        {
            ClientRequestParametersProvider = clientRequestParametersProvider;
            _logger = logger;
        }

        /// <summary>
        /// Gets the client request parameters provider.
        /// </summary>
        /// <value>The client request parameters provider.</value>
        public IClientRequestParametersProvider ClientRequestParametersProvider { get; }

        /// <summary>
        /// Gets the client request parameters.
        /// </summary>
        /// <param name="clientId">The client identifier.</param>
        /// <returns>IActionResult.</returns>
        [HttpGet("_configuration/{clientId}")]
        public IActionResult GetClientRequestParameters([FromRoute] string clientId)
        {
            var parameters = ClientRequestParametersProvider.GetClientParameters(HttpContext, clientId);
            return Ok(parameters);
        }
    }
}