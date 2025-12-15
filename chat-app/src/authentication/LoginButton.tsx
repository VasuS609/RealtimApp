import { useAuth0 } from "./useAuth0Safe";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <button 
      onClick={() => loginWithRedirect()} 
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
    >
      Log In with Auth0
    </button>
  );
};

export default LoginButton;