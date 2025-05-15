using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using BCrypt;
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
      //regex = Must have one number, one special character and 8 characters long.

      Regex validateEmailRegex = new Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
      //Console.WriteLine($"{user.Email} is {validateEmailRegex.IsMatch(user.Email)}");  // prints True     
      // Console.WriteLine($"username is {user.Username} ");

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
        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

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

    [Route("api/users/checkusername")]
    [HttpGet]
    public IActionResult CheckUsername([FromQuery] string username){
        AcebookDbContext dbContext = new AcebookDbContext();

        Console.WriteLine("arrived at backend");
        Console.WriteLine($"line 78: username is {username}");
        bool UsernameExists = dbContext.Users?.Any(u => u.Username == username) ?? false;
        Console.WriteLine($"UsernameExists is {UsernameExists}");
      return Ok(new {exists = UsernameExists});
      }


    [Route("api/users/checkemail")]
    [HttpGet]
    public IActionResult CheckEmail([FromQuery] string email){
        AcebookDbContext dbContext = new AcebookDbContext();

        Console.WriteLine("arrived at backend checking email");
        Console.WriteLine($"line 91: email is {email}");
        bool EmailExists = dbContext.Users?.Any(u => u.Email == email) ?? false;
        Console.WriteLine($"Email Exists is {EmailExists}");
      return Ok(new {exists = EmailExists});
      }
    }

