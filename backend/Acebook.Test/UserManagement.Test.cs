using NUnit.Framework;
using FluentAssertions;
using System.Net.Http.Json;
using System.Net;

namespace Acebook.Tests
{
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

    [Test]
    public async Task SignUp_ValidCredentials_ReturnsSuccess()
    {
      // Arrange
      var userData = new
      {
        email = "francine@email.com",
        password = "12345678"
      };

      // Act
      var response = await _client.PostAsJsonAsync("/api/users", userData);

      // Assert
      response.Should().BeSuccessful();
    }

    [Test]
    public async Task CreateToken_ValidCredentials_Succeeds()
    {
      // Arrange
      var credentials = new
      {
        email = "francine@email.com",
        password = "12345678"
      };

      // Act
      var response = await _client.PostAsJsonAsync("/api/tokens", credentials);

      // Assert
      response.Should().BeSuccessful();
    }

    [Test]
    public async Task CreateToken_InvalidEmail_Fails()
    {
      // Arrange
      var credentials = new
      {
        email = "not_a_user@email.com",
        password = "12345678"
      };

      // Act
      var response = await _client.PostAsJsonAsync("/api/tokens", credentials);

      // Assert
      response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }

    [Test]
    public async Task CreateToken_InvalidPassword_Fails()
    {
      // Arrange
      var credentials = new
      {
        email = "francine@email.com",
        password = "incorrectpassword"
      };

      // Act
      var response = await _client.PostAsJsonAsync("/api/tokens", credentials);

      // Assert
      response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
    }
  }
}