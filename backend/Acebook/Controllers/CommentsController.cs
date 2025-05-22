using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using acebook.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using acebook.Services;

namespace acebook.Controllers;

[ApiController]
public class CommentsController : ControllerBase
{
    private readonly ILogger<CommentsController> _logger;
    // private readonly AcebookDbContext _context;
    // public CommentsController(ILogger<CommentsController> logger, AcebookDbContext context)
    public CommentsController(ILogger<CommentsController> logger)
    {
        _logger = logger;
        // _context = context;
    }

    [Authorize]
    [Route("api/comments/getcommentsbypostid")]
    [HttpGet]
    public IActionResult GetCommentsByPostId([FromQuery] int id) // Displays the comments
    {
        AcebookDbContext dbContext = new AcebookDbContext();
        // order list from newest to oldest, replacing statement above
        Post post = dbContext.Posts?
            .Include(post => post.Comments)
            .FirstOrDefault(p => p._Id == id);
        if (post == null)
        {
            return NotFound($"No post found with ID {id}");
        }

        var comments = post.Comments?
            .OrderByDescending(c => c.CreatedAt)
            .ToList() ?? new List<Comment>();

        // Get the current user's ID from the JWT claims
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null)
        {
            return BadRequest("User ID not found in token");
        }

        var userId = int.Parse(userIdClaim.Value);
        var user = dbContext.Users.Find(userId);
        var newToken = TokenService.GenerateToken(user);

        var commentDtos = comments.Select(c => new CommentDto
        {
            _Id = c._Id,
            Message = c.Message,
            UserId = c.UserId,
            PostId = c.PostId,
            CreatedAt = c.CreatedAt
        }).ToList();

        return Ok(new {comments = commentDtos, token = newToken});
    }

    [Authorize]
    [Route("api/comments")]
    [HttpPost]
    // FromBody tells the server to find the post object in the body of the request
    public async Task<IActionResult> Create([FromBody] Comment comment) // Creates the post and send it to the database
    {
        // var postId = comment.PostId;
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

        // Add in user 
        comment.UserId = UserId;
        comment.CreatedAt = DateTime.UtcNow;
        // comment.PostId = postId; // Don't think we need this as it is sent through from frontend.

        // Add comment to the database and save it. 
        dbContext.Comments.Add(comment);
        dbContext.SaveChanges();

        var commentDto = new CommentDto
        {
            _Id = comment._Id,
            Message = comment.Message,
            UserId = comment.UserId,
            PostId = comment.PostId,
            CreatedAt = comment.CreatedAt
        };
        return Created("", new { _Id = comment._Id, comment = commentDto, token = newToken } );
    }
}
