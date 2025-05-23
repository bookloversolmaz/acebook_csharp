using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using acebook.Models;
using acebook.Services;
using System.Text.RegularExpressions;
namespace acebook.Controllers;

[ApiController]
public class TokensController : ControllerBase
{
    private readonly ILogger<TokensController> _logger;

    public TokensController(ILogger<TokensController> logger)
    {
        _logger = logger;
    }

    //LOG-IN ROUTE
    [Route("api/tokens")]
    [HttpPost]
    public IActionResult Create([FromBody] UserCredentials credentials)
    {
        AcebookDbContext dbContext = new AcebookDbContext();

        Regex validateEmailRegex = new Regex(@"^[^\s@]+@[^\s@]+\.[^\s@]+$");
        if (!validateEmailRegex.IsMatch(credentials.Email))
        {
            Console.WriteLine("Please provide a valid email");
            return BadRequest("Invalid email format");
        }

        // Find user by email
        User? user = dbContext.Users.FirstOrDefault(u => u.Email == credentials.Email);
        if (user == null)
        {
            Console.WriteLine("User not found");
            return Unauthorized("Email not registered");
        }

        // Verify password
        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(credentials.Password, user.Password);
        if (!isPasswordValid)
        {
            Console.WriteLine("Incorrect password");
            return Unauthorized("Incorrect password");
        }
        string token = TokenService.GenerateToken(user);
        return Created("", new { token });
    }

}
