using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using acebook.Models;
// using acebook.Migrations;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using acebook.Services;

namespace acebook.Controllers;

[ApiController]
public class PostsController : ControllerBase
{
    private readonly ILogger<PostsController> _logger;
    public PostsController(ILogger<PostsController> logger)
    {
        _logger = logger;
    }

    [Authorize]
    [Route("api/posts")]
    [HttpGet]
    public IActionResult Index() // Displays the post
    {
        AcebookDbContext dbContext = new AcebookDbContext();
        // List<Post> posts = dbContext.Posts.ToList();
        // order list from newest to oldest, replacing statement above
        List<Post> posts = dbContext.Posts
            // .Include(p => p.Comments)
            .OrderByDescending(p => p.CreatedAt)
            .ToList();
        // Get the current user's ID from the JWT claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return BadRequest("User ID not found in token");
        }

        var userId = int.Parse(userIdClaim.Value);
        var user = dbContext.Users.Find(userId);
        var newToken = TokenService.GenerateToken(user);

        var postDtos = posts.Select(p => new PostDto
        {
            _Id = p._Id,
            Message = p.Message,
            UserId = p.UserId,
            CreatedAt = p.CreatedAt,
            // Comments = p.Comments
        }).ToList();

        return Ok(new {posts = postDtos, token = newToken});
    }

    [Authorize]
    [Route("api/posts")]
    [HttpPost]
    // FromBody tells the server to find the post object in the body of the request
    public async Task<IActionResult> Create([FromBody] Post post) // Creates the post and send it to the database
    {
        
        AcebookDbContext dbContext = new AcebookDbContext();
        // Get the current user's ID from the JWT claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return BadRequest("User ID not found in token");
        }
        var UserId = int.Parse(userIdClaim.Value);
        var user = dbContext.Users.Find(UserId);
        var newToken = TokenService.GenerateToken(user);
        post.UserId = UserId;
        post.CreatedAt = DateTime.UtcNow;
        dbContext.Posts.Add(post);
        dbContext.SaveChanges();

        var postDto = new PostDto
        {
            _Id = post._Id,
            Message = post.Message,
            UserId = post.UserId,
            CreatedAt = post.CreatedAt
        };
        
        return Created("", new { _Id = post._Id, post = postDto, token = newToken } );
        // return Ok();
    }
}
