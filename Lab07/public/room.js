var socket = io.connect(`http://localhost:3000/rooms/${id}`)
socket.emit("room-message", "SIEEEMA")
socket.on("get-room-message", msg => {
    console.log("GOT MESSAGE" + msg)
})
console.log(id)