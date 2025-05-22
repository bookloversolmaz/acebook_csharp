namespace acebook.Models;

using System.ComponentModel.DataAnnotations;
// this is for comments
public class Comment
{
    [Key]
    public int _Id { get; set; }
    public string? Message { get; set; }

    public int PostId { get; set; }
    public Post? Post { get; set; }

    public int UserId { get; set; }
    public User? User { get; set; }

    public DateTime? CreatedAt { get; set; }

}