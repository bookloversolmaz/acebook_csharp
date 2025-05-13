// Implements the datetime interface. Writing actual code that was laid out in
// contract interface creation in ITimeProvider
// This always calls the current datetime. Use this in production. when mocking don't want current time
// just need a datetime, hence why ITimeProvider is called.
public class SystemTimeProvider : ITimeProvider
{
    public DateTime UtcNow => DateTime.UtcNow;
}