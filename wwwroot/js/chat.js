"use strict";

var connection = new signalR.HubConnectionBuilder()
    .withUrl("/chatHub")
    .withAutomaticReconnect()
    .build();

var sendButton = document.getElementById("sendButton");
var messageInput = document.getElementById("messageInput");
var userInput = document.getElementById("userInput");
var messagesList = document.getElementById("messagesList");

// Vô hiệu hóa nút gửi cho đến khi kết nối thành công
sendButton.disabled = true;

connection.on("ReceiveMessage", function (user, message) {
    var currentUser = userInput.value.trim();
    // Kiểm tra xem tin nhắn có phải do chính mình gửi hay không
    var isSelf = currentUser !== "" && currentUser === user;

    var msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message");
    msgDiv.classList.add(isSelf ? "self" : "other");

    var senderSpan = document.createElement("span");
    senderSpan.classList.add("sender");
    senderSpan.textContent = user;

    var textSpan = document.createElement("span");
    textSpan.classList.add("text");
    textSpan.textContent = message;

    msgDiv.appendChild(senderSpan);
    msgDiv.appendChild(textSpan);
    
    messagesList.appendChild(msgDiv);
    
    // Tự động cuộn xuống tin nhắn mới nhất
    messagesList.scrollTop = messagesList.scrollHeight;
});

connection.start().then(function () {
    sendButton.disabled = false;
    console.log("SignalR Connected!");
}).catch(function (err) {
    return console.error(err.toString());
});

function sendMessage() {
    var user = userInput.value.trim();
    var message = messageInput.value.trim();
    
    if (!user) {
        alert("Vui lòng nhập tên của bạn trước khi chat!");
        userInput.focus();
        return;
    }
    
    if (!message) {
        return; // Không gửi tin nhắn rỗng
    }
    
    // Gọi phương thức SendMessage trên Hub
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    
    // Xóa nội dung input sau khi gửi
    messageInput.value = "";
    messageInput.focus();
}

sendButton.addEventListener("click", function (event) {
    sendMessage();
    event.preventDefault();
});

// Cho phép nhấn Enter để gửi tin nhắn
messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        sendMessage();
        event.preventDefault();
    }
});