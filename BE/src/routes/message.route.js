import express from "express";
import { getMessages } from "../controllers/message.controller.js"; // ❌ bỏ addMessageRoute

const router = express.Router();

// chỉ cần GET lịch sử tin nhắn
router.get("/:user1/:user2", getMessages);

export default router;