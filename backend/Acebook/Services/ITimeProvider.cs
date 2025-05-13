// Defines the datetime interface. Define contract, what methods and properties 
// an object must have. This retrieves the current date and time.
public interface ITimeProvider
{
    DateTime UtcNow { get; }
}
