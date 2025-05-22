using System.Diagnostics;
using System.Net.WebSockets;
using Microsoft.AspNetCore.Mvc;
using acebook.Models;
using acebook.Services;

namespace acebook.Controllers;
// Checks if it's a websocket request and then accepts it
public class WebSocketController : ControllerBase
{
    [Route("/ws")] // Maps this method to handle HTTP GET requests to /ws
    public async Task Get()
    {
        // Checks if request includes a websocket upgrade header. Otherwise, connect is a regular http REQUEST
        if (HttpContext.WebSockets.IsWebSocketRequest)
        {
            // Accepts websocket handshale and establishes connection
            // using var ensures that the WebSocket will be automatically disposed at the end of its use.
            using var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
            // Then passes ws object to echo method, which will mange the full duplex method.
            await Echo(webSocket);
        }
        else
        {
            // if not a valid ws request, respons with a http 400 bad request
            HttpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
        }
    }
    // This method will receive messages from the client and send them back — hence, it's called Echo.
    private static async Task Echo(WebSocket webSocket)
    {
        // Creates a **4KB buffer** to store incoming message data. The size is chosen arbitrarily; large enough to handle typical messages without needing fragmentation.
        var buffer = new byte[1024 * 4];
        // Waits for a message from the WebSocket client
        // Reads it into the buffer, wrapped in an ArraySegment<byte> (which is how .NET handles buffers efficiently).
        // CancellationToken.None means: don’t cancel the operation unless an error occurs.
        var receiveResult = await webSocket.ReceiveAsync(
            new ArraySegment<byte>(buffer), CancellationToken.None);
        // Loops until clients initiates a close. closestatus being null means the connection is staill active
        while (!receiveResult.CloseStatus.HasValue)
        {
            // Echoes the message back to the client:
            // Only sends the portion of the buffer that contains data (receiveResult.Count).
            // Maintains the same message type (Text, Binary, etc.).
            // Indicates whether this is the final message in a sequence (EndOfMessage).
            await webSocket.SendAsync(
                new ArraySegment<byte>(buffer, 0, receiveResult.Count),
                receiveResult.MessageType,
                receiveResult.EndOfMessage,
                CancellationToken.None);
            // waits for next message and repeats the process
            receiveResult = await webSocket.ReceiveAsync(
                new ArraySegment<byte>(buffer), CancellationToken.None);
        }
        // when client or server closes the connection, it sends a ws close frame.
        // closes with the provided statis and description.
        await webSocket.CloseAsync(
            receiveResult.CloseStatus.Value,
            receiveResult.CloseStatusDescription,
            CancellationToken.None);
    }


}