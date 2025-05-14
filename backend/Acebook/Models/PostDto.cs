namespace acebook.Models;
// this is for responses
public class PostDto
{
    public int _Id { get; set; }
    public string Message { get; set; }
    public int? UserId { get; set; }
    public DateTime? CreatedAt {get; set;}
}