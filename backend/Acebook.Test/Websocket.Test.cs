using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System.Net.WebSockets;
using System.Text;
using System.Threading.Tasks;
using System.Threading;


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
        public async Task CheckThatItsAWebsocketRequest()
        {
            var client = new ClientWebSocket();
            await client.ConnectAsync(new Uri("ws://localhost:5287/ws"), CancellationToken.None);

            Console.WriteLine("Connected!");

            var message = Encoding.UTF8.GetBytes("Hello from client");
            await client.SendAsync(new ArraySegment<byte>(message), WebSocketMessageType.Text, true, CancellationToken.None);

            var buffer = new byte[1024];
            var result = await client.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            Console.WriteLine("Received: " + Encoding.UTF8.GetString(buffer, 0, result.Count));

            await client.CloseAsync(WebSocketCloseStatus.NormalClosure, "Done", CancellationToken.None);

        }
    }
}
