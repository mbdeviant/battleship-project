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
const playerBoardData = {};
let tmpTurn = 0;
let tmpGameover = false;
// let turn = 0;
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

  socket.on("check-players", () => {
    const players = [];
    for (const i in connections) {
      connections[i] === null
        ? players.push({ connected: false, ready: false })
        : players.push({ connected: true, ready: connections[i] });
    }
    socket.emit("check-players", players);
  });

  socket.on("board-data", (data) => {
    playerBoardData[playerIndex] = data;

    if (Object.keys(playerBoardData).length === 2) {
      const player1BoardData = playerBoardData[0];
      const player2BoardData = playerBoardData[1];

      io.emit("start-game", player1BoardData, player2BoardData);
    }
  });

  socket.on("fire", (id, turn) => {
    console.log(`shot fired from ${playerIndex}`, id);

    if (turn === tmpTurn) {
      socket.broadcast.emit("fire", id);
    } else console.log("not your turn");
  });
  socket.on("turn-change", (turnNum) => {
    console.log(`current player turn ${turnNum}`);

    tmpTurn = turnNum;
    io.emit("turn-change", tmpTurn);
    console.log(`${turnNum} turn changed brox`);
  });

  socket.on("gameover", (gameover) => {
    tmpGameover = gameover;
    io.emit("gameover", tmpGameover);
    console.log(`${tmpGameover} gameover brox`);
  });
});
