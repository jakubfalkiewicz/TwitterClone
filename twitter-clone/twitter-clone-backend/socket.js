module.exports = {
  start: function (io) {
    io.on("connection", function (socket) {
      console.log("Someone connected");
      //   socket.on("newPost", (newPost) => {
      //     socket.emit("newPost", newPost);
      //   });
    });
    return io;
  },
};
