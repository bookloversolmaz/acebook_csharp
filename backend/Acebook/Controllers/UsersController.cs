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
      try{
      AcebookDbContext dbContext = new AcebookDbContext();
      
      bool EmailExists = dbContext.Users?.Any(u => u.Email == user.Email) ?? false;
      bool UsernameExists = dbContext.Users?.Any(u => u.Username == user.Username) ?? false;

      Regex validatePasswordRegex = new Regex("^(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
      //Console.WriteLine($"{user.Password} is {validatePasswordRegex.IsMatch(user.Password)}");  // prints True
      
      Regex validateEmailRegex = new Regex("^\\S+@\\S+\\.\\S+$");
      //Console.WriteLine($"{user.Email} is {validateEmailRegex.IsMatch(user.Email)}");  // prints True     
      Console.WriteLine($"username is {user.Username} ");

      if(EmailExists || UsernameExists){
        Console.WriteLine($"Email or username already in db");
        return BadRequest(); 
      }
      else if(user.Username == null || user.Username == ""){
          Console.WriteLine($"Username does not exist");
          return BadRequest();
      }
      else if(user.Email == null || validateEmailRegex.IsMatch(user.Email) == false){
          Console.WriteLine($"Email null or invalid");
          return BadRequest();
      }
      else if(user.Password == null || validatePasswordRegex.IsMatch(user.Password) == false){
        Console.WriteLine($"password null or invalid");
        return BadRequest(); 
      }
      else{  
      dbContext.Users.Add(user);
      dbContext.SaveChanges();
      string location = "api/users/" + user._Id;
      return Created();
      }
      }
      catch (Exception e)
      {
        Console.WriteLine("❌ Exception caught in Create(): " + e.Message);
        return StatusCode(500, e.Message); // for debug only
      }
      
    }
}
