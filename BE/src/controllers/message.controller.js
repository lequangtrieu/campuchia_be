import Message from "../models/message.models.js";

export const getMessages = async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ thêm hàm addMessage để server.js gọi
export const addMessage = async (sender, receiver, content) => {
  try {
    const newMessage = new Message({ sender, receiver, content });
    await newMessage.save();
    console.log("💾 Message saved to MongoDB");
    return newMessage;
  } catch (err) {
    console.error("❌ Error saving message:", err);
  }
};