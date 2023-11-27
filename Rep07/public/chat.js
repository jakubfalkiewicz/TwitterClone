// const socket = io.connect("http://localhost:3000/globalChat");
const socket = io.connect();
const now = moment();
const currSocket = document.getElementById("socketId");
const input = document.getElementById("input");
const messagesList = document.getElementById("messages");
const submit = document.getElementById("submit");

setTimeout(() => {
  const socketId = socket.id;
  currSocket.innerHTML = `Current socketId: ${socketId}`;

  submit.addEventListener("click", (event) => {
    event.preventDefault();
    if (input.value.trim().length !== 0) {
      const message = {
        user: socketId,
        date: now.format("HH:mm:ss"),
        content: input.value,
      };
      axios
        .post("http://localhost:3000/messages/", message)
        .then((res) => socket.emit("global-message", message))
        .catch((err) => {
          if (err.response.data.code === 401) {
            window.location.href = "http://localhost:3000/login";
          }
        });
    }
    input.value = "";
  });

  socket.on("global-message", (res, err) => {
    const chatMessage = document.createElement("li");
    chatMessage.innerHTML = `${res.user}: ${res.content} | ${res.date}`;
    messagesList.appendChild(chatMessage);
  });
}, 1000);
