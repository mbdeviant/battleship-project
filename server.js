/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

// Serve static files from the 'dist' directory
app.use(express.static("dist"));

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
