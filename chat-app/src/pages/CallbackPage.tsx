import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "../authentication/useAuth0Safe";

export default function CallbackPage() {
  const { isAuthenticated, error } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/chat");
    } else if (error) {
      console.error("Auth0 Error:", error.message); 
      navigate("/");
    }
  }, [isAuthenticated, error, navigate]);

  return <div>Processing login...</div>;
}