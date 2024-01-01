import express from "express";
import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import SimplePeer from "simple-peer";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
const app = express();

app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: "Content-Type, Recipient-Socket-Id, x-socket-id",
  })
);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: "Content-Type, Recipient-Socket-Id, x-socket-id",
  },
});

const users = {};

app.use(express.json());

// Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  try {
    const fileData = req.file.buffer;
    const recipientNickname = req.headers["recipient-socket-id"];
    const senderSocketId = req.headers["x-socket-id"];

    const recipientSocketId = Object.keys(users).find(
      (socketId) => users[socketId] === recipientNickname
    );

    if (recipientSocketId) {
      const fileId = uuidv4();

      // Notify sender and recipient to initiate P2P file transfer
      io.to(senderSocketId).emit("initiateFileTransfer", {
        fileId,
        recipientSocketId,
        fileData,
      });

      io.to(recipientSocketId).emit("initiateFileTransfer", {
        fileId,
        senderSocketId,
        fileData,
      });

      console.log("File ready for transfer");
      res.status(200).json({ fileId });
    } else {
      console.log("Recipient socket not found", recipientNickname);
      res.status(404).send("Recipient not found");
    }
  } catch (error) {
    console.error("Error handling file upload:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

// Handle P2P connections
io.on("connection", (socket) => {
  socket.on("setNickname", (nickname) => {
    users[socket.id] = nickname;
    io.emit("updateUsers", Object.values(users));
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    delete users[socket.id];
    io.emit("updateUsers", Object.keys(users));
    console.log("Socket disconnected");
  });

  // Handle initiation of file transfer
  socket.on("initiateFileTransfer", ({ fileId, targetSocketId, fileData }) => {
    console.log("Initiating file transfer to targetSocketId:", targetSocketId);
  });

  // Handle response to offer signal
  socket.on("answerSignal", ({ fileId, signal, senderSocketId, fileData }) => {
    console.log("Answering offer signal from senderSocketId:", senderSocketId);
    const peer = new SimplePeer({ initiator: false, trickle: false });

    // Signal back to the sender
    peer.signal(signal);

    peer.on("data", (data) => {
      console.log("Received data from peer:", data.toString());
    });

    peer.on("error", (error) => {
      console.error("Peer error:", error.message);
    });

    peer.on("close", () => {
      console.log("Peer connection closed");
    });

    // Send the file data to the peer
    peer.send(fileData);
  });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
