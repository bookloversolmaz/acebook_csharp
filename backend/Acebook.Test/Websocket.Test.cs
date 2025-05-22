using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using NUnit.Framework;

namespace Acebook.Tests
{
    [TestFixture]
    public class WebSocketsController
    {
        private HttpClient _client;
        [SetUp]
        public void Setup()
        {
            _client = new HttpClient();
            _client.BaseAddress = new Uri("http://localhost:5287");
        }
        // Arrange, act, assert
        // Checks if it's a websocket request
        [TearDown]
        public void TearDown()
        {
            _client.Dispose();
        }
        [Test]
        public async Task CheckThatItsAWebsocketRequestAndCanConnect()
        {
            // creates new instance of clientwebsocket, .net class used to open websocket to a server
            var client = new ClientWebSocket();
            // initiates websocket handshake connects at ws. cancellationtoken.none means don't cancel
            await client.ConnectAsync(new Uri("ws://localhost:5287/ws"), CancellationToken.None);

            Console.WriteLine("Connected!"); // confirms that the connection succeeded
            // converts a string into a byte array using UTF-8, which is required by the websocket api
            var message = Encoding.UTF8.GetBytes("Hello from client");
            // sends a message over websocket connection. WebSocketMessageType.Text, message is a text. true, end of message. cancellationtoken means not trying to cancel operation
            await client.SendAsync(new ArraySegment<byte>(message), WebSocketMessageType.Text, true, CancellationToken.None);
            // Prepares buffer to receive response from server. In controller, server will echo back the message
            var buffer = new byte[1024];
            // Awaits for response from server. Contains info like how many bytes were read and what type of message it was
            var result = await client.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            // Decodes bytes array into a readable string. Logs the message received from the server
            Console.WriteLine("Received: " + Encoding.UTF8.GetString(buffer, 0, result.Count));

            await client.CloseAsync(WebSocketCloseStatus.NormalClosure, "Done", CancellationToken.None);
        }
        // Returns error message if for non websocket requests
        [Test]
        public async Task ShouldReturn400ForNonWebSocketRequest()
        {
            var response = await _client.GetAsync("/ws");
            Assert.That(response.StatusCode, Is.EqualTo(System.Net.HttpStatusCode.BadRequest));

        }
        // Test large message handling
        [Test]
        public async Task ShouldHandleLargeMessages()
        {
            var client = new ClientWebSocket();
            await client.ConnectAsync(new Uri("ws://localhost:5287/ws"), CancellationToken.None);

            Console.WriteLine("Connected!");

            var message = Encoding.UTF8.GetBytes("Can handle large messages");
            await client.SendAsync(new ArraySegment<byte>(message), WebSocketMessageType.Text, true, CancellationToken.None);

            var buffer = new byte[8192];
            var result = await client.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            Console.WriteLine("Received: " + Encoding.UTF8.GetString(buffer, 0, result.Count));

            await client.CloseAsync(WebSocketCloseStatus.NormalClosure, "Done", CancellationToken.None);

        }
        // Can handle disconnect
        [Test]
        public async Task ShouldCloseOnDisconnect()
        {
            var client = new ClientWebSocket();
            await client.ConnectAsync(new Uri("ws://localhost:5287/ws"), CancellationToken.None);
            await client.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client done", CancellationToken.None);
            Assert.That(WebSocketState.Closed, Is.EqualTo(client.State));
        }
    }
}
