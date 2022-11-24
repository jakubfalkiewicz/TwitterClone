const rooms = document.getElementById("roomList");
const newRoom = document.getElementById("addNewRoom");
const roomName = document.getElementById("newRoomName");
const logged = sessionStorage.getItem("loggedId");
const roomList = document.getElementById("roomList");
var socket = io.connect();

async function loadRooms(){
 await axios.get("/rooms/").then(res => {
    res.data.forEach(e => {
      console.log(e)
      const room = document.createElement("a");
      room.setAttribute("href", `/room/${e._id}`);
      room.innerHTML = e.name;
      roomList.appendChild(room);
    })
  })
};
loadRooms();
newRoom.addEventListener("click", async () => {
  if (roomName.value != "" && logged) {
    await axios.post("/rooms/", {name: roomName.value, creator: logged, messages: []}).then(res => console.log(res)).catch(err => console.log(err))
    const room = document.createElement("a");
    room.setAttribute("href", `/rooms/${roomName.value}`);
    room.innerHTML = roomName.value;
    roomList.appendChild(room);
    socket.emit("join-room", roomName.value);
    roomName.value = "";
  }
});
socket.on("create-room", function (room) {
  socket.join(room);
});

let data = sessionStorage.getItem("loggedId");
async function loggedIsAdmin() {
  await axios.get("/users/").then((response) => {
    const admin = response.data.filter((el) => el._id === data.toString())[0]
      .admin;
    if (admin) {
      document
        .querySelectorAll("button")
        .forEach((el) => (el.style.opacity = "1"));
    }
  });
};
loggedIsAdmin();
async function deleteUser(id) {
  await axios
    .delete(`/users/${id}`)
    .then((response) => console.log(response.data))
    .catch((err) => console.log(err));
  const result = confirm("Are you sure?");
  if (result) {
    document.getElementById(id).remove();
  }
}
function editUser(id) {
  const userLogin = document.getElementById(id).firstElementChild.textContent;
  const userEmail = document.getElementById(id).children[1].innerHTML;
  var loginInput = document.createElement("input");
  loginInput.type = "text";
  loginInput.placeholder = userLogin;
  var emailInput = document.createElement("input");
  emailInput.type = "text";
  emailInput.placeholder = userEmail;
  console.log(emailInput);
  document.getElementById(id).appendChild(loginInput);
  document.getElementById(id).appendChild(emailInput);
  const confirmButton = document.createElement("button");
  confirmButton.innerHTML = "SAVE";
  confirmButton.addEventListener("click", () => {
    axios
      .put(`/users/${id}`, {
        email: document.getElementById(id).children[5].value,
        login: document.getElementById(id).children[4].value,
      })
      .then((response) => location.reload())
      .catch((err) => console.log(err));
  });
  document.getElementById(id).appendChild(confirmButton);
}
