import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../authentication/LogoutButton";

export default function ChatPage() {
  const { isAuthenticated } = useAuth0();

  if (!isAuthenticated) return <div>You must log in first.</div>;

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold">Chat Page</h1>
      <LogoutButton />
    </div>
  );
}
