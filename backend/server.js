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

// Setup Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit, adjust as needed
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

  // Handle file upload
  socket.on("uploadFile", (fileData, recipientSocketId) => {
    const recipientSocket = io.sockets.sockets.get(recipientSocketId);

    if (recipientSocket) {
      recipientSocket.emit("receiveFile", { sender: socket.id, fileData });
    }
  });
});

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No File Found");
    }
    console.log("File received:", req.file.originalname);
    const fileData = req.file.buffer.toString("base64");
    const recipientSocketId = req.headers["recipient-socket-id"];
    console.log("Recipient socket ID:", recipientSocketId);
    const recipientSocket = io.sockets.sockets.get(recipientSocketId);

    if (recipientSocket) {
      recipientSocket.emit("receiveFile", {
        sender: req.headers["x-socket-id"],
        fileData,
      });
      console.log("File uploaded successfully to", recipientSocketId);
    } else {
      console.error("Recipient socket not found:", recipientSocketId);
    }

    res.send("File uploaded successfully");
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
