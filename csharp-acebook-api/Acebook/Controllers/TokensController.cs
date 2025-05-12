using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using acebook.Models;
using acebook.Services;

namespace acebook.Controllers;

[ApiController]
public class TokensController : ControllerBase
{
    private readonly ILogger<TokensController> _logger;

    public TokensController(ILogger<TokensController> logger)
    {
        _logger = logger;
    }

    [Route("api/tokens")]
    [HttpPost]
    public IActionResult Create([FromBody] UserCredentials credentials) {
      AcebookDbContext dbContext = new AcebookDbContext();
      User? user = dbContext.Users.FirstOrDefault(user => user.Email == credentials.Email);
      if(user != null && user.Password == credentials.Password)
      {
        string token = TokenService.GenerateToken(user);
        return Created("", new { token });
      }
      else
      {
        return Unauthorized();
      }
    }
}
