import { useNavigate } from "react-router-dom";

export default function ChatButton() {
  const navigate = useNavigate();

  const handleChat = () => {
    console.log("redirected to chat section");
    navigate("/chat");
  };

  return (
    <div>
      <button onClick={handleChat} className="button chat">
        Chat
      </button>
      
    </div>
  );
}