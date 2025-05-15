namespace acebook.Models;
using Microsoft.EntityFrameworkCore;

public class AcebookDbContext : DbContext
{
    public DbSet<Post>? Posts { get; set; }
    public DbSet<User>? Users { get; set; }

    public string? DbPath { get; }

    public string? DatabaseHostArg = Environment.GetEnvironmentVariable("DATABASE_HOST") ?? "localhost";
    public string? DatabaseUsernameArg = Environment.GetEnvironmentVariable("DATABASE_USERNAME") ?? "postgres";
    public string? DatabasePasswordArg = Environment.GetEnvironmentVariable("DATABASE_PASSWORD") ?? "1234";

    public string? GetDatabaseName()
  {
    string? DatabaseNameArg = Environment.GetEnvironmentVariable("DATABASE_NAME");

    if (DatabaseNameArg == null)
    {
      System.Console.WriteLine(
        "DATABASE_NAME is null. Defaulting to test database."
      );
      return "acebook_csharp_test";
    }
    else
    {
      System.Console.WriteLine(
        "Connecting to " + DatabaseNameArg
      );
      return DatabaseNameArg;
    }
  }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseNpgsql(@$"Host={DatabaseHostArg};Username={DatabaseUsernameArg};Password={DatabasePasswordArg};Database=" + GetDatabaseName());
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Post>()
          .Navigation(post => post.User)
          .AutoInclude();
    }
}
