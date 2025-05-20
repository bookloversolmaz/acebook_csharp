using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using BCrypt;
using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Web;  
using System.IO;
using System.Drawing;
// using MemoryStream;
using acebook.Models;
using acebook.Services;
namespace acebook.Controllers;

[ApiController]
public class UsersController : ControllerBase
{
  private readonly ILogger<UsersController> _logger;

  public UsersController(ILogger<UsersController> logger)
  {
    _logger = logger;
  }


  [HttpGet("get-profile-picture")]
  public IActionResult GetProfilePicture()
  {
    byte[] imageData = System.IO.File.ReadAllBytes("Uploads/Profile_Image_Default.png");
    return File(imageData, "image/png");
  }

  //SIGN-UP ROUTE
  [Route("api/users")]
  [HttpPost]
  public IActionResult Create([FromBody] User user)
  {
    try
    {
      AcebookDbContext dbContext = new AcebookDbContext();
      bool EmailExists = dbContext.Users?.Any(u => u.Email == user.Email) ?? false;
      bool UsernameExists = dbContext.Users?.Any(u => u.Username == user.Username) ?? false;
      Regex validatePasswordRegex = new Regex("^(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
      //regex = Must have one number, one special character and 8 characters long.
      Regex validateEmailRegex = new Regex("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

      if (EmailExists || UsernameExists)
      {
        Console.WriteLine($"Email or username already in db");
        return BadRequest();
      }
      else if (user.Username == null || user.Username == "")
      {
        Console.WriteLine($"Username does not exist");
        return BadRequest();
      }
      else if (user.Email == null || validateEmailRegex.IsMatch(user.Email) == false)
      {
        Console.WriteLine($"Email null or invalid");
        return BadRequest();
      }
      else if (user.Password == null || validatePasswordRegex.IsMatch(user.Password) == false)
      {
        Console.WriteLine($"password null or invalid");
        return BadRequest();
      }
      else
      {
        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
        if (user.ProfilePicture == null || user.ProfilePicture.Length == 0)
        {
          var defaultImagePath = Path.Combine(AppContext.BaseDirectory, "Uploads", "Profile_Image_Default.png");

          if (System.IO.File.Exists(defaultImagePath))
          {
            user.ProfilePicture = System.IO.File.ReadAllBytes(defaultImagePath);
          }
          else
          {
            Console.WriteLine("⚠️ Default profile image not found.");
          }
        }
        Console.WriteLine($"user.profilepic is {user.ProfilePicture}");
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
  public IActionResult CheckUsername([FromQuery] string username)
  {
    AcebookDbContext dbContext = new AcebookDbContext();
    bool UsernameExists = dbContext.Users?.Any(u => u.Username == username) ?? false;
    return Ok(new { exists = UsernameExists });
  }


  [Route("api/users/checkemail")]
  [HttpGet]
  public IActionResult CheckEmail([FromQuery] string email)
  {
    AcebookDbContext dbContext = new AcebookDbContext();
    bool EmailExists = dbContext.Users?.Any(u => u.Email == email) ?? false;
    return Ok(new { exists = EmailExists });
  }

  [Route("api/users/getuserbyid")]
  [HttpGet]
  public IActionResult GetUserById([FromQuery] int id)
  {
    AcebookDbContext dbContext = new AcebookDbContext();
    User userForDto = dbContext.Users?.FirstOrDefault(u => u._Id == id);

    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
    if (userIdClaim == null)
    {
      return BadRequest("User ID not found in token");
    }

    var userId = int.Parse(userIdClaim.Value);
    var user = dbContext.Users.Find(userId);
    var newToken = TokenService.GenerateToken(user);
    // Console.WriteLine($"useddto {UserDto}");
    var userDtoToReturn = new UserDto
    {
      _Id = userForDto._Id,
      Username = userForDto.Username,
      ProfilePicture = userForDto.ProfilePicture,
      Posts = userForDto.Posts
    };

    Console.WriteLine($"userDtoToReturn {userDtoToReturn.ProfilePicture}");
    return Ok(new { user = userDtoToReturn, token = newToken });
  }


    [HttpGet("getprofilepicbyid")]
    public IActionResult GetProfilePicById([FromQuery] int id)
    {
    AcebookDbContext dbContext = new AcebookDbContext();
    var user = dbContext.Users.FirstOrDefault(u => u._Id == id);

    if (user == null)
    {
        return NotFound();
    }

    var userDto = new
    {
        profilePicture = user.ProfilePicture != null
            ? Convert.ToBase64String(user.ProfilePicture)
            : null
    };

    return Ok(new { user = userDto });
    }


    }

