using NUnit.Framework;
using FluentAssertions;
using System.Net.Http.Json;
using System.Net;

namespace Acebook.Tests
{
  //this tests both login(TokensController) and signup(UsersController) functions
[TestFixture]
  public class UserManagement
  {
    private HttpClient _client;

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

    [Test] //1
    public async Task SignUp_ValidCredentials_ReturnsSuccess()
    {
      // Arrange
      var userData = new
      {
        email = "freida@email.com",
        password = "Secret78!"
      };

      // Act
      var response = await _client.PostAsJsonAsync("/api/users", userData);

      // Assert
      response.Should().BeSuccessful();
    }

    [Test]// 2.Test that password declared invalid if it doesn't meet requirement: 8 chars long, has special chars and is alpha-numeric 
    public async Task SignUp_InvalidPassword_ReturnsErrorMsg()
    {
      var  userData = new
      {
        email = "jane@email.com",
        password = "fail"
      };
      var response = await _client.PostAsJsonAsync("/api/users", userData);

      string expected = "Invalid password. Must be 8 characters long, have special chracters and be alphanumeric";
  
      Assert.That(response.IsSuccessStatusCode, Is.False, expected); 
    }

    [Test] //3.Check that email provided is valid
    public async Task SignUp_InvalidEmail_ReturnsErrorMsg()
    {
      var  userData = new
      {
        email = "janeemailcom",
        password = "Secret78!"
      };
      var response = await _client.PostAsJsonAsync("/api/users", userData);

      string expected = "Invalid email. Please provide a valid email";

      Assert.That(response.IsSuccessStatusCode, Is.False, expected); 
    }
    [Test]//4. Checks that an email is not already being used in db
    public async Task SignUp_EmailDuplicated_ReturnsErrorMsg()
    {
      var  userData1 = new
      {
        email = "jt@email.com",
        password = "Secret78!"
      };
      await _client.PostAsJsonAsync("/api/users", userData1);
      
      var  userData2 = new
      {
        email = "jt@email.com",
        password = "Secret78!"
      };
      var response = await _client.PostAsJsonAsync("/api/users", userData2);

      string expected = "Email already in use. Please provide a different email";
    
      Assert.That(response.IsSuccessStatusCode, Is.False, expected); 
    }
    [Test] // Signup - Checks that an email is provided else an error msg is given
    public async Task SignUp_NoEmailProvided_ReturnsErrMsg()
    {
      var userData = new 
      {
        email = "",
        password = "Secret12!"
      };

      var response = await _client.PostAsJsonAsync("/api/users", userData);

      string expected = "No email provided. Please provide a valid email address.";

      Assert.That(response.IsSuccessStatusCode, Is.False);
    }
    // [Test] // Signup - Checks that a username is provided else an error msg is given
    // [Test] // Signup - Checks that a username is not already being used in db

    [Test]//5. login
    public async Task CreateToken_ValidCredentials_Succeeds()
    {
      var userData = new
      {
        email = "Joan@email.com",
        password = "Secret78!"
      };

      // Act
       await _client.PostAsJsonAsync("/api/users", userData);
      // Arrange
      var credentials = new
      {
       email = "Joan@email.com",
        password = "Secret78!"
      };

      // Act
      var response = await _client.PostAsJsonAsync("/api/tokens", credentials);

      // Assert
      response.Should().BeSuccessful();
    }

    [Test]//6. login
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

      // Assert
      response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Test]//7. login
    public async Task CreateToken_InvalidPassword_Fails()
    {
      
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