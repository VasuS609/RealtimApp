import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import CallbackPage from "./pages/CallbackPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/callback" element={<CallbackPage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}
