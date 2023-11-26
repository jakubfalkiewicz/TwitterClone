// const socket = io.connect("http://localhost:3000/globalChat");
const socket = io.connect();
const now = moment();
const currSocket = document.getElementById("socketId");
const input = document.getElementById("input");
const messagesList = document.getElementById("messages");
const submit = document.getElementById("submit");
var socketId;

setTimeout(() => {
  socketId = socket.id;
  currSocket.innerHTML = `Current socketId: ${socketId}`;

  submit.addEventListener("click", (event) => {
    event.preventDefault();
    if (input.value.trim().length !== 0) {
      socket.emit("global-message", {
        message: input.value,
        sender: socketId,
        time: now.format("HH:mm:ss"),
      });
      // axios
      //   .get("https://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=2")
      //   .then((res) => console.log(res));
    }
    input.value = "";
  });

  socket.on("global-message", (res, err) => {
    const chatMessage = document.createElement("li");
    chatMessage.innerHTML = `${res.sender}: ${res.message} | ${res.time}`;
    messagesList.appendChild(chatMessage);
  });

  //   socket.on("user-join", (res, err) => {
  //     const chatMessage = document.createElement("li");
  //     chatMessage.innerHTML = `${res.sender}: ${res.message}`;
  //     messagesList.appendChild(chatMessage);
  //   });
}, 1000);
