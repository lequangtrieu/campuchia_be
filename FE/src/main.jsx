import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Chat from "./Page/Chat.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Route mặc định */}
        <Route path="/" element={<App />} />

        {/* Route chat theo URL dạng /Chat/ThangNTA-BinhVV */}
        <Route path="/Chat/:chatId" element={<Chat />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);