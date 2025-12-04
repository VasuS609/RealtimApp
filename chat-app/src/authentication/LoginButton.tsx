import { useAuth0 } from "./useAuth0Safe";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button 
      onClick={() => loginWithRedirect()} 
      className="button login"
    >
      Log In
    </button>
  );
};

export default LoginButton;