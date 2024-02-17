chat = io(`http://${location.host}/rooms/${roomId}`);
chat.on("connect", () => {
  console.log(`Nawiązano połączenie z kanałem „${roomId}"`);
});
const logged = sessionStorage.getItem("loggedId");
const messageForm = document.getElementById("form");
const joinRoomForm = document.getElementById("join-room-form");
const chatMessages = document.getElementById("messages");
const input = document.getElementById("input");
const joinRoomInput = document.getElementById("join-room-input");

async function eligibleUser() {
  const room = await axios.get(`http://localhost:3000/api/rooms/${roomId}`);
  if (room.data[0].joinedUsers.includes(logged)) {
    joinRoomForm.style.visibility = "hidden";
  }
}
eligibleUser();

chat.on("message", (msg) => {
  const { sender, message } = msg;
  const newMessage = document.createElement("div");
  newMessage.classList.add("list-group-item");
  newMessage.classList.add("list-group-item-dark");
  newMessage.innerText = `${sender}: ${message}`;
  chatMessages.append(newMessage);
  messageForm.reset();
});

joinRoomForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  const password = joinRoomInput.value;
  console.log(password);
  if (!logged) {
    alert("Please log in first!");
    return;
  }
  const joinResult = await axios
    .post(`http://localhost:3000/api/rooms/join/${roomId}`, {
      _id: roomId,
      password: password,
      userToJoin: logged,
    })
    .then((res) => res.data);
  if (joinResult.correct === true) {
    joinRoomForm.style.visibility = "hidden";
  }
  joinRoomInput.value = "";
});

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  const message = input.value;
  console.log(message);
  if (!logged) {
    alert("Please log in first!");
    return;
  }
  chat.emit("message", message, logged);
  const newMessage = document.createElement("div");
  newMessage.classList.add("list-group-item");
  newMessage.classList.add("list-group-item-secondary");
  newMessage.innerText = `You: ${message}`;
  chatMessages.append(newMessage);
  input.value = "";
});
console.log("SIEEMA");
