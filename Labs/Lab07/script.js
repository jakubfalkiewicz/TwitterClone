const roomId = document.getElementById("theUser").value;
const logged = sessionStorage.getItem("loggedId");

var socket = io();
socket.emit("get-room-owner-id", roomId, logged);
socket.on("receive-id", function (id) {
  sessionStorage.setItem(`${roomId}`, id);
  console.log(`Received chat owner ID: ${id}`);
  console.log(socket.id);
});
if (logged) {
  socket.on("connect", function (data) {
    socket.emit("storeClientInfo", {
      customId: logged,
    });
  });
}
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const room = sessionStorage.getItem(`${roomId}`);
  console.log(room);
  if (!logged) {
    alert("Please log in first");
    window.location.href = "http://localhost:3000/";
  }
  if (input.value && logged) {
    console.log("Client-sending-chat-message");
    socket.emit("chat-message", input.value, room, logged);
    input.value = "";
  }
});
socket.on("receive-message", (msg, sender) => {
  console.log("Client received chat message");
  var item = document.createElement("li");
  async function getUsers() {
    await axios.get("http://localhost:3000/users/").then((res) => {
      const senderLogin = res.data.filter((el) => el._id == sender)[0].login;
      console.log(senderLogin);
      item.textContent = `${senderLogin}: ${msg}`;
      messages.appendChild(item);
    });
  }
  getUsers();
});
