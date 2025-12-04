import { useAuth0 } from "./useAuth0Safe";

const LogoutButton = () => {
  const { logout } = useAuth0();
  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="button logout"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;