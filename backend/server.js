import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";

dotenv.config();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: "Content-Type",
  })
);

const httpServer = app.listen(process.env.PORT || 8080, () =>
  console.log(
    `Server running on ${
      process.env.TYPE === "DEVELOPMENT"
        ? "http://localhost:8080"
        : process.env.HOSTEDURL
    }`
  )
);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("New client connected in sockets");

  socket.on("setNickname", (nickname) => {
    users[socket.id] = nickname;
    io.emit("updateUsers", Object.values(users));
  });

  // Listen for the disconnect event
  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("updateUsers", Object.values(users));
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});
