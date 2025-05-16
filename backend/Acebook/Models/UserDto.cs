namespace acebook.Models;

public class UserDto
{
    public int _Id {get; set;}
    public string? Username {get; set;}
    // public string? ProfileImage {get; set; }
    public ICollection<Post>? Posts {get; set;}
}