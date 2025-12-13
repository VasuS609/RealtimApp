import { Header, Body, Footer } from "../VideoComponents";
import { useAuth0 } from "../authentication/useAuth0Safe";
import LoginButton from "../authentication/LoginButton";
import LogoutButton from "../authentication/LogoutButton";
import Profile from "../authentication/Profile";

export default function Cavlo() {
  const { isAuthenticated, isLoading } = useAuth0();

  return (
    <div>
      <Header />
      <div className="pt-20 px-4">
        {isLoading ? (
          <p>Loading authentication...</p>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center gap-4">
            <p>Please log in to use Cavlo.</p>
            <LoginButton />
          </div>
        ) : (
          <>
            <div className="flex justify-end gap-3 mb-4">
              <Profile />
              <LogoutButton />
            </div>
            <Body />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}