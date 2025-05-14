using Npgsql;
using NUnit.Framework;

[SetUpFixture]
public class TestDatabaseSetup
{
    private readonly string _connectionString =$"Host=localhost;Database=acebook_csharp_test;Username={Environment.GetEnvironmentVariable("DATABASE_USERNAME")};";

    [OneTimeSetUp]
    public void GlobalSetup()
    {
        ClearDatabase();
        SeedTestUser();
    }

    [OneTimeTearDown]
    public void GlobalTeardown()
    {
        ClearDatabase();
    }

    private void ClearDatabase()
    {
        using var conn = new NpgsqlConnection(_connectionString);
        conn.Open();

        // Truncate Posts first, then Users (to respect foreign keys)
        using var cmd = new NpgsqlCommand("TRUNCATE TABLE \"Posts\", \"Users\" RESTART IDENTITY CASCADE;", conn);
        cmd.ExecuteNonQuery();
    }

    private void SeedTestUser()
    {
        using var conn = new NpgsqlConnection(_connectionString);
        conn.Open();

        using var cmd = new NpgsqlCommand(@"
            INSERT INTO ""Users"" (""Username"", ""Email"", ""Password"")
            VALUES ('Fran', 'francine@email.com', 'Secret78!')
        ", conn);
        cmd.ExecuteNonQuery();
    }
}
