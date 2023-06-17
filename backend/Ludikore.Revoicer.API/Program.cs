using Ludikore.Revoicer.API.BackgroundServices;
using Ludikore.Revoicer.API.Hubs;
using Ludikore.Revoicer.Services;
using Ludikore.Revoicer.Services.Cloud;
using Ludikore.Revoicer.Services.IO;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddEnvironmentVariables("REVOICER_").AddJsonFile("appsettings.json");

// Add services to the container.
//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer()
    .AddSwaggerGen(c => { c.SwaggerDoc("v1", new() { Title = "Ludikore.Revoicer.API", Version = "v1" }); })
    .AddCors()
    .AddSignalR(options => { options.EnableDetailedErrors = true; });

builder.Services.AddLogging();
builder.Services.AddHostedService<RevoicerListenerService>();
builder.Services.AddHostedService<SplitterListenerService>();
builder.Services.AddScoped<FileRepository>();
builder.Services.AddScoped<SplitterService>();
builder.Services.AddScoped<RevoicerService>();


var app = builder.Build();

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

app.Run();
