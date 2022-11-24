const roomId = document.getElementById("theUser").value;
const logged = sessionStorage.getItem("loggedId");
var socket = io(`http://localhost:3000/rooms/${id}`);
socket.emit("room-message", "SIEEEMA");
socket.on("room-message", (msg) => {
  console.log("GOT MESSAGE" + msg);
});
console.log(id);
var messages = document.getElementById("messages");
var form = document.getElementById("form");
var input = document.getElementById("input");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const room = sessionStorage.getItem(`${roomId}`);
  console.log(room);
  if (!logged) {
    alert("Please log in first");
    window.location.href = "/";
  }
  if (input.value && logged) {
    console.log("Client-sending-chat-message");
    socket.emit("chat-message", input.value);
    input.value = "";
  }
});