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

  // public User(byte[] ProfilePicture)
  // {
  //   if (ProfilePicture == null)
  //   {
  //     // ProfilePicture = LoadDefaultProfilePicture();
  //     new MemoryStream(ProfilePicture);
  //   }
  // }

  // private byte[] LoadDefaultProfilePicture()
  // {
   
  //     Console.WriteLine("Current working directory: " + Directory.GetCurrentDirectory());

  //     string path = Path.Combine(Directory.GetCurrentDirectory(), "Acebook", "Uploads", "Profile_Image_Default.png");

  //     if (File.Exists(path))
  //     {
  //       return File.ReadAllBytes(path);
  //     }

  //     return Array.Empty<byte>(); // Fallback if file is missing
  //   }

}
