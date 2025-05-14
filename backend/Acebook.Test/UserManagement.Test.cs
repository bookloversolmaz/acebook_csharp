using NUnit.Framework;
using FluentAssertions;
using System.Net.Http.Json;
using System.Net;
using BCrypt.Net;
using Npgsql;

namespace Acebook.Tests
{
  //this tests both login(TokensController) and signup(UsersController) functions
[TestFixture]
  public class UserManagement
  {
    private HttpClient _client;
    private readonly string _connectionString = $"Host=localhost;Database=acebook_csharp_test;Username={Environment.GetEnvironmentVariable("DATABASE_USERNAME")};";


    [SetUp]
    public void Setup()
    {
      _client = new HttpClient();
      _client.BaseAddress = new Uri("http://localhost:5287");
    }

    [TearDown]
    public void TearDown()
    {
      _client.Dispose();
    }

    [Test] 
    public async Task SignUp_ValidCredentials_ReturnsSuccess()
    {
      // Arrange
      var userData = new
      {
        username = "Mary",
        email = "mary@email.com",
        password = "Secret78!"
      };

      // Act
      var response = await _client.PostAsJsonAsync("/api/users", userData);

      // Assert
      Assert.That(response.IsSuccessStatusCode, Is.True);
    }

    [Test]// Test that password declared invalid if it doesn't meet requirement: 8 chars long, has special chars and is alpha-numeric 
    public async Task SignUp_InvalidPassword_ReturnsBadRequest()
    {
      var  userData = new
      {
        username = "Jan",
        email = "jane@email.com",
        password = "fail"
      };
      var response = await _client.PostAsJsonAsync("/api/users", userData);
  
      Assert.That(response.IsSuccessStatusCode, Is.False); 
    }

    [Test] // checks that a password is hashed
    public async Task SignUp_PasswordHashedInDB_ReturnsSuccess(){

      var userData = new
      {
        username = "Lisa",
        email = "lisa@email.com",
        password = "Secret123!"
      };

      var response = await _client.PostAsJsonAsync("/api/users", userData);

      await using var conn = new NpgsqlConnection(_connectionString);
        conn.Open();

      await using var cmd = new NpgsqlCommand("SELECT \"Password\" FROM \"Users\" WHERE \"Email\" = @Email", conn);
      cmd.Parameters.AddWithValue("@Email", "lisa@email.com");
      var passwordHash = (string?)await cmd.ExecuteScalarAsync();

      Console.WriteLine($"passwordhash is {passwordHash}");
      var result = BCrypt.Net.BCrypt.Verify("Secret123!", passwordHash);
      Assert.That(result, Is.True);
    }

    [Test] //Check that email provided is valid
    public async Task SignUp_InvalidEmail_ReturnsBadRequest()
    {
      var  userData = new
      {
        username = "Jane",
        email = "janeemailcom",
        password = "Secret78!"
      };
      var response = await _client.PostAsJsonAsync("/api/users", userData);

      Assert.That(response.IsSuccessStatusCode, Is.False); 
    }
    [Test]//Checks that an email is not already being used in db
    public async Task SignUp_EmailDuplicated_ReturnsBadRequest()
    {
      var  userData1 = new
      {
        username = "Jake",
        email = "jtll@email.com",
        password = "Secret78!"
      };
      await _client.PostAsJsonAsync("/api/users", userData1);
      
      var  userData2 = new
      {
        username = "John",
        email = "jtll@email.com",
        password = "Secret78!"
      };
      var response = await _client.PostAsJsonAsync("/api/users", userData2);
    
      Assert.That(response.IsSuccessStatusCode, Is.False); 
    }
    [Test] // Signup - Checks that an email is provided else an error msg is given
    public async Task SignUp_NoEmailProvided_ReturnsBadRequest()
    {
      var userData = new 
      {
        username = "Perry",
        email = "",
        password = "Secret12!"
      };

      var response = await _client.PostAsJsonAsync("/api/users", userData);

      Assert.That(response.IsSuccessStatusCode, Is.False);
    }
    [Test] // Signup - Checks that a username is provided else an error msg is given
    public async Task SignUp_NoUsernameProvided_ReturnsBadRequest()
    {
      var userData = new 
      {
        username = "",
        email = "pt@test.com",
        password = "Secret12!"
      };

      var response = await _client.PostAsJsonAsync("/api/users", userData);

      Assert.That(response.IsSuccessStatusCode, Is.False);
    }

  [Test] // Signup - Checks that a username is not already being used in db
   public async Task SignUp_UsernameDuplicated_ReturnsBadRequest()
    {
      var  userData1 = new
      {
        username = "Jason",
        email = "jt@email.com",
        password = "Secret78!"
      };
      await _client.PostAsJsonAsync("/api/users", userData1);
      
      var  userData2 = new
      {
        username = "Jason",
        email = "jtddd@email.com",
        password = "Secret78!"
      };
      var response = await _client.PostAsJsonAsync("/api/users", userData2);
    
      Assert.That(response.IsSuccessStatusCode, Is.False); 
    }
    [Test]// login
    public async Task CreateToken_ValidCredentials_Succeeds()
    {
      var userData = new
      {
        username = "Joan",
        email = "joan@email.com",
        password = "Secret78!"
      };

      // Act
       await _client.PostAsJsonAsync("/api/users", userData);
      // Arrange
      var credentials = new
      {
        email = "joan@email.com",
        password = "Secret78!"
      };

      // Act
      var response = await _client.PostAsJsonAsync("/api/tokens", credentials);

      // Assert
      response.Should().BeSuccessful();
    }

    [Test]// login
    public async Task CreateToken_InvalidEmail_Fails()
    {
      // Arrange
      var credentials = new
      {
        email = "not_a_user@email.com",
        password = "Secret78!"
      };

      // Act
      var response = await _client.PostAsJsonAsync("/api/tokens", credentials);
      Console.WriteLine($"credentials.email is {credentials.email}");
      Console.WriteLine($"response.StatusCode is {response}");
      // Assert
      response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Test]// login
    public async Task CreateToken_InvalidPassword_Fails()
    {

      var userData = new
      {
        username = "Franck",
        email = "frank@email.com",
        password = "Secret123!"
      }; 

      await _client.PostAsJsonAsync("/api/users", userData);
      // Arrange
      var credentials = new
      {
        email = "frank@email.com",
        password = "incorrectpassword"
      };

      // Act
      var response = await _client.PostAsJsonAsync("/api/tokens", credentials);

      // Assert
      response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
  }
 }