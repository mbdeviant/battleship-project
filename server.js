/* eslint-disable import/newline-after-import */
/* eslint-disable import/no-extraneous-dependencies */
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

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// server.listen(3000, () => {
//   console.log("Server is running on http://localhost:3000");
// });
