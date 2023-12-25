import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io"; 

dotenv.config();

const whitelist = process.env.WHITELISTED_SITES
  ? process.env.WHITELISTED_SITES.split(",")
  : "*";

const app = express();

app.use(
  cors({
    origin: whitelist,
  })
);

// store the list of users
const users = {};
// store users in socket rooms 
const socketToRoom = {};

const httpServer = app.listen(process.env.PORT || 8080, () =>
  console.log(
    `Server running on ${
      process.env.TYPE === "DEVELOPMENT"
        ? "http://localhost:8080"
        : process.env.HOSTEDURL
    }`
  )
);

app.get("/", (req, res) => {
    res.send("Server is running");
})

const io = new Server(httpServer);

io.on("connection", (socket) => {
    console.log("New client connected in sockets");
});

