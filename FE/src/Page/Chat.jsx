import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Alert,
} from "@mui/material";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { SERVER_URL, SCAM_URL } from "../config/server.js";

const socket = io(SERVER_URL, {
  transports: ["websocket"],
});

const Chat = () => {
  const { chatId } = useParams();
  const [user1, user2] = chatId.split("-");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [scamWarning, setScamWarning] = useState(null);
  const messagesEndRef = useRef(null);

  // ✅ Load lịch sử
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${SERVER_URL}/api/messages/${user1}/${user2}`
        );
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
      }
    };
    fetchMessages();
  }, [user1, user2]);

  // ✅ Lắng nghe realtime
  useEffect(() => {
    socket.on("receiveMessage", async (msg) => {
      if (
        (msg.sender === user1 && msg.receiver === user2) ||
        (msg.sender === user2 && msg.receiver === user1)
      ) {
        setMessages((prev) => [...prev, msg]);
        await analyzeMessage(msg.content || msg.text);
      }
    });

    return () => socket.off("receiveMessage");
  }, [user1, user2]);

  // ✅ Cuộn xuống cuối
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

// ✅ Phân tích scam
const analyzeMessage = async (message) => {
  try {
    const res = await fetch(`${SCAM_URL}/detect`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();

    // 🚨 Nếu có emoji cảnh báo thì hiển thị, nhưng loại bỏ emoji khi render
    if (data.result.includes("⚠️")) {
      const cleanWarning = data.result.replace("⚠️", "").trim();
      setScamWarning(cleanWarning);
    } else {
      setScamWarning(null);
    }
  } catch (err) {
    console.error("❌ Error calling scam API:", err);
  }
};

  // ✅ Gửi tin nhắn
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = { sender: user1, receiver: user2, content: input };
    socket.emit("sendMessage", newMsg);

    try {
      await fetch(`${SERVER_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
      await analyzeMessage(input);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }

    setInput("");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        bgcolor: "#e9eef6",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 0, md: 2 },
      }}
    >
      {/* Chat container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,
          height: "90vh",
          bgcolor: "white",
          borderRadius: { xs: 0, md: 4 },
          boxShadow: { md: 3 },
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            bgcolor: "#0084ff",
            color: "white",
            py: 2,
            px: 3,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Avatar sx={{ bgcolor: "#ffffff33" }}>
            {user2.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {user2}
          </Typography>
        </Box>

        {/* ⚠️ Cảnh báo scam */}
        {scamWarning && (
          <Alert
            severity="warning"
            sx={{
              borderRadius: 0,
              textAlign: "center",
              fontWeight: 500,
              bgcolor: "#fff3e0",
            }}
          >
            {scamWarning}
          </Alert>
        )}

        {/* Messages */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            bgcolor: "#f0f2f5",
          }}
        >
          {messages.map((msg, i) => {
            const isOwn = msg.sender === user1;
            return (
              <Box
                key={i}
                sx={{
                  alignSelf: isOwn ? "flex-end" : "flex-start",
                  bgcolor: isOwn ? "#0084ff" : "white",
                  color: isOwn ? "white" : "black",
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  maxWidth: "75%",
                  boxShadow: 1,
                  fontSize: "0.95rem",
                  borderTopRightRadius: isOwn ? 0 : 12,
                  borderTopLeftRadius: isOwn ? 12 : 0,
                }}
              >
                {!isOwn && (
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 600, opacity: 0.7 }}
                  >
                    {msg.sender}
                  </Typography>
                )}
                <Typography>{msg.content || msg.text}</Typography>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1.5,
            borderTop: "1px solid #ddd",
            bgcolor: "white",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Nhập tin nhắn..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            sx={{
              mr: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 5,
                bgcolor: "#f0f2f5",
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={sendMessage}
            sx={{
              bgcolor: "#0084ff",
              color: "white",
              "&:hover": { bgcolor: "#0073e6" },
            }}
          >
            <SendRoundedIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;