const express = require("express");
const socket = require("socket.io");
const cors = require("cors");
const app = express();
app.use(cors);
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log("server is runing.....");
});

const io = socket(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("join_room", (data) => {
    console.log("joined room", data);
    socket.join(data);
  });
  socket.on("send_message", (data) => {
    console.log("sent message", data);
    socket.to(data.room).emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
