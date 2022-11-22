const rooms = document.getElementById("roomList")
const newRoom = document.getElementById("addNewRoom")
const roomName = document.getElementById("newRoomName")
const logged = sessionStorage.getItem("loggedId");
const roomList = document.getElementById("roomList")
var socket = io.connect();
newRoom.addEventListener("click", () =>{
    if (roomName.value != "" && logged){
        const room = document.createElement("a");
        room.setAttribute("href", `http://localhost:3000/rooms/${roomName.value}`);
        room.innerHTML = roomName.value
        roomList.appendChild(room)
        socket.emit("join-room", roomName.value)
        roomName.value = ""
    } 
}
)
socket.on('create-room', function (room) {
    socket.join(room);
  });
  