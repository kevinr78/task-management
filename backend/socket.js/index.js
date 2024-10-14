// socket/index.js
let ioInstance = null;
const connectedUsers = {};
import { Server } from "socket.io";
import {
  sendNotification,
  removeTaskNotification,
} from "../controllers/notification.controller.js";

const init = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Adjust as needed for security
      methods: ["GET", "POST"],
    },
  });
  ioInstance = io;

  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
      for (const key in connectedUsers) {
        if (connectedUsers[key] === socket.id) {
          delete connectedUsers[key];
        }
      }
    });

    socket.on("notification", (data) => {
      sendNotification(data);
    });

    socket.on("removeTask", (data) => {
      removeTaskNotification(data);
    });

    socket.on("register", (id) => {
      console.log(connectedUsers);
      connectedUsers[id] = socket.id;
      socket.join(id);
    });
  });

  return io;
};

const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized!");
  }
  return ioInstance;
};

export { getIO, init, connectedUsers };
