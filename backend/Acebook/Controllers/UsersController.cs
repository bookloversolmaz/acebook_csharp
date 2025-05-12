using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using acebook.Models;

namespace acebook.Controllers;

[ApiController]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;

    public UsersController(ILogger<UsersController> logger)
    {
        _logger = logger;
    }

    [Route("api/users")]
    [HttpPost]
    public IActionResult Create([FromBody] User user) {
      AcebookDbContext dbContext = new AcebookDbContext();
      dbContext.Users.Add(user);
      dbContext.SaveChanges();
      string location = "api/users/" + user._Id;
      return Created();
    }
}
