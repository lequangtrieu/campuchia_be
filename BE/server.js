import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./src/database/database.js";
import { addMessage } from "./src/controllers/message.controller.js"; // ✅ import đúng chỗ này
import messageRoutes from "./src/routes/message.route.js";

// Kết nối MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/messages", messageRoutes);

// Tạo HTTP + Socket.IO server
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// ✅ Socket.io realtime
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("sendMessage", async (data) => {
    const { sender, receiver, content } = data;

    // Lưu vào MongoDB
    await addMessage(sender, receiver, content);

    // Gửi lại cho tất cả client (realtime)
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// ✅ Port khởi động server
const PORT = 5009;
server
  .listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`❌ Port ${PORT} is already in use. Try another port.`);
    } else {
      console.error(err);
    }
  });