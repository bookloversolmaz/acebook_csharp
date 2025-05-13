namespace acebook.Models;
using System.ComponentModel.DataAnnotations;

public class Post
{
  [Key]
  public int _Id {get; set;}
  public string? Message {get; set;}
  public int UserId {get; set;}
  public User? User {get; set;}
  public DateTime CreatedAt {get; set;}

}