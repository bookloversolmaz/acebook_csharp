using acebook.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System;
using DotNetEnv;

Env.Load(".env");

var configBuilder = new ConfigurationBuilder();
configBuilder.AddEnvironmentVariables();

var builder = WebApplication.CreateBuilder(args);

// Register DbContext
builder.Services.AddDbContext<AcebookDbContext>();

builder.Logging.SetMinimumLevel(LogLevel.Information);

// Add services to the container.
builder.Services.AddControllers();

// Add Swagger/OpenAPI support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Acebook API",
        Version = "v1",
        Description = "API for Acebook social media platform"
    });

    // Configure Swagger to use JWT Authentication
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = "Acebook Backend",
            ValidAudience = "Acebook Frontend",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("my_super_duper_secret_1234567890")),
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AcebookDbContext>();
    db.Database.Migrate(); // This applies any pending migrations
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Acebook API V1");
        c.RoutePrefix = "api-docs";
    });
}
else
{
    app.UseExceptionHandler("/error");
}

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
