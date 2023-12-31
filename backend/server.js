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
  limits: { fileSize: 1024 * 1024 * 150 }, // 150 MB limit
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

  socket.on("uploadFile", (fileData, recipientNickname) => {
    const recipientSocketId = Object.keys(users).find(
      (socketId) => users[socketId] === recipientNickname
    );

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveFile", {
        sender: { id: socket.id, nickname: users[socket.id] },
        fileData,
      });
      console.log("File sent to", recipientNickname);
    } else {
      console.log("Recipient socket not found", recipientNickname);
    }
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    console.log("Upload starting...");
    const fileData = req.file.buffer.toString("base64");
    const recipientNickname = req.headers["recipient-socket-id"];
    const senderSocketId = req.headers["x-socket-id"];

    const recipientSocketId = Object.keys(users).find(
      (socketId) => users[socketId] === recipientNickname
    );

    console.log("Recipient socket id", recipientSocketId);
    // if (recipientSocketId) {
    //   io.to(recipientSocketId).emit("receiveFile", {
    //     sender: { id: senderSocketId, nickname: users[senderSocketId] },
    //     fileData,
    //   });
    //   res.status(200).send("File uploaded successfully");
    // } else {
    //   console.log("Recipient socket not found", recipientNickname);
    //   res.status(404).send("Recipient socket not found");
    // }

    console.log("function completed");
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
