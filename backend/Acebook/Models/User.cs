namespace acebook.Models;
using System.ComponentModel.DataAnnotations;

public class User
{
  [Key]
  public int _Id { get; set; }
  public string? Username { get; set; }
  public string? Email { get; set; }
  public string? Password { get; set; }

  public byte[]? ProfilePicture { get; set; }
  public ICollection<Post>? Posts { get; set; }
  public ICollection<Comment>? Comments { get; set; }

}
