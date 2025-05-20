using NUnit.Framework;
using FluentAssertions;
using System.Net.Http.Json;
using System.Net;
using System.Text.Json;
using System.Net.Http.Headers;
using System;
using Microsoft.Extensions.Logging; // For ILogger&lt;&gt;
using NSubstitute;
using acebook.Models;

namespace Acebook.Tests
{
  [TestFixture]
  public class ProfilePage
  {
    private HttpClient _client;

    private User userData = new User
    {
      Username = "Lina",
      Email = "lina@email.com",
      Password = "Secret123!",
      ProfilePicture = File.ReadAllBytes("TestAssets/Profile_Image_Default.png")
    };


    [SetUp]
    // Create new user, sign in as user and then use that for the tests
    public async Task Setup()
    {
      _client = new HttpClient();
      _client.BaseAddress = new Uri("http://localhost:5287");
      // Arrange


      // Act
      await _client.PostAsJsonAsync("/api/users", userData); // Created new user
      var response = await _client.PostAsJsonAsync("/api/tokens", userData); // Signed in new user
      var Json = await response.Content.ReadFromJsonAsync<JsonElement>(); // Extracted the json data only from the response
      var token = Json.GetProperty("token").GetString(); // Extracted the token as a string from the Json
      _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token); // Whenever _client sends something, it has the authorisation containing the token, which is a JWT token (bearer) and here is the token
    }

    // TODO: clear out database?
    [TearDown]
    public void TearDown()
    {
      _client.Dispose();
    }

    [Test]
    // TODO: use client to send request, pass in message and user id. Check create post and sign user in OR use token
    public async Task UserDtoReturnedWithUsernameFromDbSelectRequest()
    {
      // Arrange
      AcebookDbContext dbContext = new AcebookDbContext();
      User user = dbContext.Users?.FirstOrDefault(u => u.Username == userData.Username);
      var userId = user._Id;
      // Act
      var response = await _client.GetAsync($"/api/users/getuserbyid?id={userId}");
      // Assert
      response.Should().BeSuccessful();
      var json = await response.Content.ReadFromJsonAsync<JsonElement>();
      json.GetProperty("user").GetProperty("username").GetString().Should().Be("Lina");
    }

    [Test]
    // TODO: use client to send request, pass in token and user id. Get user information inclidung profile picture
    public async Task UserDtoReturnedWithProfilePictureFromDbSelectRequest()
    {
      // Arrange
      AcebookDbContext dbContext = new AcebookDbContext();
      User user = dbContext.Users?.FirstOrDefault(u => u.Username == userData.Username);
      var userId = user._Id;
      // Act
      var response = await _client.GetAsync($"/api/users/getuserbyid?id={userId}");
      // Assert
      response.Should().BeSuccessful();
      var json = await response.Content.ReadFromJsonAsync<JsonElement>();
      json.GetProperty("user").GetProperty("profilepicture").GetByte().Should().Be(File.ReadAllBytes("TestAssets/Profile_Image_Default.png"));
      
    }
}
}