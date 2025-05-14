using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
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

    //SIGN-UP ROUTE
    [Route("api/users")]
    [HttpPost]
    public IActionResult Create([FromBody] User user) {
      AcebookDbContext dbContext = new AcebookDbContext();
      
      bool EmailExists = dbContext.Users?.Any(u => u.Email == user.Email) ?? false;

      Regex validatePasswordRegex = new Regex("^(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
      //Console.WriteLine($"{user.Password} is {validatePasswordRegex.IsMatch(user.Password)}");  // prints True
      
      Regex validateEmailRegex = new Regex("^\\S+@\\S+\\.\\S+$");
      //Console.WriteLine($"{user.Email} is {validateEmailRegex.IsMatch(user.Email)}");  // prints True     
      Console.WriteLine($"{user.Email} exists is {EmailExists}");

      if(EmailExists){
        return BadRequest(); 
      }
      else if(user.Email == null || validateEmailRegex.IsMatch(user.Email) == false){
          return BadRequest(); 
      }
      else if(user.Password == null || validatePasswordRegex.IsMatch(user.Password) == false){
        return BadRequest(); 
      } 
      else{
      dbContext.Users.Add(user);
      dbContext.SaveChanges();
      string location = "api/users/" + user._Id;
      return Created();
      }
      
    }
}
