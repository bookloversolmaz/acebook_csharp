namespace acebook.Models;
using Microsoft.EntityFrameworkCore;

public class AcebookDbContext : DbContext
{
    public DbSet<Post>? Posts { get; set; }
    public DbSet<User>? Users { get; set; }
    public string? DbHost = Environment.GetEnvironmentVariable("DB_HOST") ?? "localhost";

    public string? DbUsername = Environment.GetEnvironmentVariable("DATABASE_USERNAME") ?? "postgres";
    public string? DbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD") ?? "1234";
    public string? DbName = Environment.GetEnvironmentVariable("DATABASE_NAME") ?? "acebook_csharp_test";

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {
        Console.WriteLine($"Host={DbHost};Username={DbUsername};Password={DbPassword};Database={DbName}");
        optionsBuilder.UseNpgsql($"Host={DbHost};Username={DbUsername};Password={DbPassword};Database={DbName}");
    }    
    
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>()
            .Navigation(post => post.User)
            .AutoInclude();
    }
}
