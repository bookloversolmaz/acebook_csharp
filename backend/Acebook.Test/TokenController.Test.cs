using NUnit.Framework;
using FluentAssertions;
using System.Net.Http.Json;
using System.Net;
using System.Text.Json;
using System.Net.Http.Headers;
using System;
using Microsoft.Extensions.Logging; // For ILogger&lt;&gt;
using NSubstitute;

namespace Acebook.Tests
{
    [TestFixture]
    public class TokenTest
    {
        private HttpClient _client;
        [SetUp]
        public void SetUp()
        {
            // HttpClient from System.Net.Http. Creates instance and then sets its basea adress, to use relative URLS like 
            // api /users rather than fulls urls. Uri is from system. Purpose is to send HTTP requests to local API on port 5287
            _client = new HttpClient();
            _client.BaseAddress = new Uri("http://localhost:5287");
        }

        [TearDown]
        public void TearDown()
        {
            _client.Dispose();
        }

        [Test] // Marks method as a test. From NUnit. Needed for the test runner to recognise and execute method.
               // Checks that an existing user can log in
        public async Task UserShouldBeAbleToSuccessfullyLogIn() // Method makes http requests, hence the use of async
        {
            // Arrange: Create mock user data. Go to log in page. Creates anonymous object containng test credentials.
            var registerUser = new
            {
                email = "test100@hotmail.com",
                username = "testuser",
                password = "usertest1?"
            };
            var loginUser = new
            {
                email = registerUser.email,
                password = registerUser.password
            };
            // Act: simulate user registration in API
            // Sends POST request to /api/users with userData in JSON. PostAsJsonAsync extension method from System.Net.Http.Json
            var response = await _client.PostAsJsonAsync("/api/users", registerUser);
            // Assert: checks that the regiatration request returned HTTP 201 created. Assert.That... from NUnit.
            // HttpStatusCode is from System.Net. confirms that the user was successfully registered.
            Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.Created));

            // Act: Sends a POST request to /api/tokens using the same credentials to log in, to test that the login works after registration.
            var loginResponse = await _client.PostAsJsonAsync("/api/tokens", loginUser);
            // Assert: checks that login was successful and token was created. API responds with HTTP 201 + token on successful login.
            Assert.That(loginResponse.StatusCode, Is.EqualTo(HttpStatusCode.Created));

            // Act: extract and verify token. Reads the JSON response body as a JsonElement.
            // ReadFromJsonAsync<T>() is from System.Net.Http.Json. JsonElement is from System.Text.Json.
            var json = await loginResponse.Content.ReadFromJsonAsync<JsonElement>();
            // Extracts the "token" property from the JSON object and converts it to a string, to verify that the user received a token.
            var token = json.GetProperty("token").GetString();
            // Assert: checks that token string is not null. if this failsm user didn't receive token and login failed.
            Assert.That(token, Is.Not.Null);
        }

        // Incorrect email format

        // Cannot find user by emai, returns error message

        // Incorrect password

        // User log in successful, can generate token

    }
}



