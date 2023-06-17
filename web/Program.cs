using System.Diagnostics;
using Ludikore.Revoicer.Web.Hubs;
using Ludikore.Revoicer.Services;
using Ludikore.Revoicer.Services.Application;
using Ludikore.Revoicer.Services.Azure;
using Ludikore.Revoicer.Services.Cloud;
using Ludikore.Revoicer.Services.IO;
using Ludikore.Revoicer.Web.BackgroundServices;
using Microsoft.Extensions.FileProviders;
using System.Net;
using AspNetCore.Proxy;
using Ludikore.Revoicer.Web.Extensions;
using Microsoft.AspNetCore.SpaServices.ReactDevelopmentServer;
using Microsoft.Build.Execution;
using Microsoft.Extensions.Azure;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
  .AddEnvironmentVariables("REVOICER_")
  .AddJsonFile("appsettings.json");

// Add services to the container.
//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer()
  .AddSwaggerGen(c => { c.SwaggerDoc("v1", new() { Title = "Ludikore.Revoicer.API", Version = "v1" }); })
  .AddCors()
  .AddSignalR(options => { options.EnableDetailedErrors = true; });

builder.Services.AddSerilog(logConfig =>
{
  logConfig.WriteTo.Console().WriteTo.File("/data/web.log");
});
builder.Services.AddSingleton<CloudSettings>();

builder.Services.AddTransient<CloudQueueService, ServiceBusService>();
builder.Services.AddTransient<CloudStorageService, BlobStorageService>();

builder.Services.AddHostedService<RevoicerListenerService>();
builder.Services.AddHostedService<SplitterListenerService>();

builder.Services.AddScoped<FileRepository>();
builder.Services.AddScoped<SplitterService>();
builder.Services.AddScoped<RevoicerService>();


if (builder.Environment.IsDevelopment())
{
  builder.Services.Configure<ForwardedHeadersOptions>(options =>
  {
    options.ForwardLimit = 2;
    options.KnownProxies.Add(IPAddress.Parse("127.0.10.1"));
    options.ForwardedForHeaderName = "X-Forwarded-For-My-Custom-Header-Name";
  });
  builder.Services.AddSpaStaticFiles(config =>
  {
    config.RootPath = "./ClientApp/build";
  });
}

builder.Services.AddControllers();
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

var app = builder.Build();
var tasks = new List<Task>();


if (app.Environment.IsDevelopment())
{
  tasks.Add(app.UseReactDevServer(3000));
}
else
{
  app.UseSpaStaticFiles();
}

app.UseStaticFiles();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseWebSockets();


// app.UseAuthentication();
// app.UseAuthorization();
app.UseCors(
  a => a
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials()
    .SetIsOriginAllowed(host => true)
);

app.MapControllers();
app.MapHub<RevoicerHub>("/api/revoicer");

app.MapControllerRoute(
  name: "default",
  pattern: "{controller}/{action=Index}/{id?}");
app.MapRazorPages();

app.MapFallbackToFile("index.html");


tasks.Add(app.RunAsync());
await Task.WhenAll(tasks);
