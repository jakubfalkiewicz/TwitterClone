const publicChat = io(`http://${location.host}/publicChat`);
const currSocketPublic = document.getElementById("socketId-p");
const inputPublic = document.getElementById("input-p");
const messagesListPublic = document.getElementById("messages-p");
const submitPublic = document.getElementById("submit-p");

publicChat.on("connect", () => {
  const socketIdPublic = publicChat.id;
  currSocketPublic.innerHTML = `Current socketId: ${socketIdPublic}`;

  submitPublic.addEventListener("click", (event) => {
    event.preventDefault();
    if (inputPublic.value.trim().length !== 0) {
      var date = new Date();
      const message = {
        user: socketIdPublic.slice(0, 5),
        date: date.toLocaleTimeString(),
        content: inputPublic.value,
      };
      publicChat.emit("public-message", message);
      const chatMessagePublic = document.createElement("li");
      chatMessagePublic.innerHTML = `${message.user}: ${message.content} | ${message.date}`;
      messagesListPublic.appendChild(chatMessagePublic);
    }

    inputPublic.value = "";
  });

  publicChat.on("public-message", (res, err) => {
    const chatMessagePublic = document.createElement("li");
    chatMessagePublic.innerHTML = `${res.user}: ${res.content} | ${res.date}`;
    messagesListPublic.appendChild(chatMessagePublic);
  });

  publicChat.on("user-connect", (res, err) => {
    const chatMessagePublic = document.createElement("li");
    chatMessagePublic.innerHTML = `${res}: Connected`;
    messagesListPublic.appendChild(chatMessagePublic);
  });

  publicChat.on("user-disconnect", (res, err) => {
    const chatMessagePublic = document.createElement("li");
    chatMessagePublic.innerHTML = `${res}: Disconnected`;
    messagesListPublic.appendChild(chatMessagePublic);
  });
});
