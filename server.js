const express = require("express");
const path = require("path");
const http = require("http");
const PORT = process.env.PORT || 3000;
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Serve static files from the 'dist' directory

app.use(express.static(path.join(__dirname, "dist")));

server.listen(PORT, () =>
  console.log(`server is running on localhost:${PORT}`)
);

const connections = [null, null];
io.on("connection", (socket) => {
  let playerIndex = -1;
  for (const i in connections) {
    if (connections[i] == null) {
      playerIndex = i;
      break;
    }
  }
  socket.emit("player-number", playerIndex);

  console.log(`player ${playerIndex} has connected`);

  if (playerIndex === -1) return;

  connections[playerIndex] = false;

  // announce player connections
  socket.broadcast.emit("player-connection", playerIndex);

  // handle disconnect
  socket.on("disconnect", () => {
    console.log(`player ${playerIndex} has disconnected`);
    connections[playerIndex] = null;
    socket.broadcast.emit("player-connection", playerIndex);
  });

  socket.on("player-ready", () => {
    socket.broadcast.emit("enemy-ready", playerIndex);
    connections[playerIndex] = true;
  });
});
