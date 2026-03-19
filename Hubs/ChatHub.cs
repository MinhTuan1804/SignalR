using Microsoft.AspNetCore.SignalR;

namespace SignalR.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message)
        {
            // Gửi tin nhắn đến tất cả các client đang kết nối
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }
    }
}
