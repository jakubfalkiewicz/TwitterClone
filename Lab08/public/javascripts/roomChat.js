chat = io(`http://${location.host}/rooms/${roomId}`);
chat.on("connect", () => {
  console.log(`Nawiązano połączenie z kanałem „${roomId}"`);
});
const logged = sessionStorage.getItem("loggedId");
const messageForm = document.getElementById("form");
const chatMessages = document.getElementById("messages");
const input = document.getElementById("input");
chat.on("message", (msg) => {
  const { sender, message } = msg;
  const newMessage = document.createElement("div");
  newMessage.classList.add("list-group-item");
  newMessage.classList.add("list-group-item-dark");
  newMessage.innerText = `${sender}: ${message}`;
  chatMessages.append(newMessage);
  messageForm.reset();
});
// form.addEventListener("submit", function (e) {
//   e.preventDefault();
//   const room = sessionStorage.getItem(`${roomId}`);
//   console.log(room);
//   if (!logged) {
//     alert("Please log in first");
//     window.location.href = "/";
//   }
//   if (input.value && logged) {
//     console.log("Client-sending-chat-message");
//     socket.emit("chat-message", input.value);
//     input.value = "";
//   }
// });
messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  const message = input.value;
  console.log(message);
  chat.emit("message", message, logged);
  const newMessage = document.createElement("div");
  newMessage.classList.add("list-group-item");
  newMessage.classList.add("list-group-item-secondary");
  newMessage.innerText = `You: ${message}`;
  chatMessages.append(newMessage);
  input.value = "";
});
console.log("SIEEMA");
