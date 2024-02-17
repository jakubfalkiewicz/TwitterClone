const socket = io(`http://${location.host}/globalChat`);
const currSocket = document.getElementById("socketId");
const input = document.getElementById("input");
const messagesList = document.getElementById("messages");
const submit = document.getElementById("submit");

setTimeout(async () => {
  const socketId = socket.id;
  currSocket.innerHTML = `Current socketId: ${socketId}`;

  submit.addEventListener("click", (event) => {
    event.preventDefault();
    if (input.value.trim().length !== 0) {
      var date = new Date();
      const message = {
        user: socketId,
        date: date.toLocaleTimeString(),
        content: input.value,
      };
      axios
        .post("http://localhost:3000/messages/", message)
        .then((res) => {
          socket.emit("global-message", res.data);
          const chatMessage = document.createElement("li");
          console.log(res.data);
          chatMessage.innerHTML = `${res.data.user}: ${res.data.content} | ${res.data.date}`;
          messagesList.appendChild(chatMessage);
        })
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
