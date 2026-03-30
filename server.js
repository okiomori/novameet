const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("join-room", ({ roomId, userName }) => {
    if (!rooms[roomId]) rooms[roomId] = [];

    rooms[roomId].push({
      id: socket.id,
      name: userName,
    });

    const otherUsers = rooms[roomId].filter(u => u.id !== socket.id);

    socket.emit("all-users", otherUsers);

    socket.to(roomId).emit("user-joined", {
      signal: null,
      callerId: socket.id,
      userName,
    });

    socket.join(roomId);

    socket.on("sending-signal", (payload) => {
      io.to(payload.userToSignal).emit("user-joined", {
        signal: payload.signal,
        callerId: payload.callerId,
        userName: payload.userName,
      });
    });

    socket.on("returning-signal", (payload) => {
      io.to(payload.callerId).emit("receiving-returned-signal", {
        signal: payload.signal,
        id: socket.id,
      });
    });

    socket.on("disconnect", () => {
      rooms[roomId] = (rooms[roomId] || []).filter(u => u.id !== socket.id);
      socket.to(roomId).emit("user-left", socket.id);
    });
  });
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
