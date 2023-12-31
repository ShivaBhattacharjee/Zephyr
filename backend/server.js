import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import path from "path";

dotenv.config();
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: "Content-Type, Recipient-Socket-Id, x-socket-id",
  })
);

// Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  // limit cause i dont want to bazuka my server with 1GB files yeah i am broke
  limits: { fileSize: 1024 * 1024 * 150 }, // 150 MB limit, adjust as needed
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: "Content-Type, Recipient-Socket-Id , x-socket-id",
  },
});

const users = {};

io.on("connection", (socket) => {
  socket.on("setNickname", (nickname) => {
    users[socket.id] = nickname;
    io.emit("updateUsers", Object.values(users));
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("updateUsers", Object.keys(users));
  });

  socket.on("uploadFile", (fileData, recipientSocketId) => {
    const recipientSocket = io.sockets.sockets.get(recipientSocketId);

    if (recipientSocket) {
      recipientSocket.emit("receiveFile", {
        sender: { id: socket.id, nickname: users[socket.id] },
        fileData,
      });
    }
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const recipientSocketId = req.headers["recipient-socket-id"];
    // const recipientSocket = io.sockets.connected[recipientSocketId];
    // console.log("Recipient socket:", recipientSocket);
    // console.log("Recipient socket ID:", recipientSocketId);
  } catch (error) {
    console.error("Error handling file upload:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () =>
  console.log(
    `Server running on ${
      process.env.TYPE === "DEVELOPMENT"
        ? "http://localhost:8080"
        : process.env.HOSTEDURL
    }`
  )
);
