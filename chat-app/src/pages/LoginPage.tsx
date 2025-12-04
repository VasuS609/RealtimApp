import { useAuth0 } from "../authentication/useAuth0Safe";
import LoginButton from "../authentication/LoginButton";
import LogoutButton from "../authentication/LogoutButton";
import Profile from "../authentication/Profile";
import ChatButton from "../authentication/ChatButton";

export default function LoginPage() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) return <div>Loading Auth0...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex flex-col items-center mt-10">
      <img
        src="https://cdn.auth0.com/quantum-assets/dist/latest/logos/auth0/auth0-lockup-en-ondark.png"
        alt="Auth0 Logo"
        className="w-48 mb-6"
      />

      {isAuthenticated ? (
        <>
          <p className="text-green-400 font-semibold">Logged In</p>
          <Profile />
          <ChatButton />
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </div>
  );
}
