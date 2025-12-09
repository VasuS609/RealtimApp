// main.tsx (fixed)
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

const renderApp = () => {
  if (auth0Domain && auth0ClientId) {
    return (
      <Auth0Provider
        domain={auth0Domain}
        clientId={auth0ClientId}
        authorizationParams={{ 
          redirect_uri: window.location.origin,
          scope: 'openid profile email'
        }}
        useRefreshTokens={true}
        cacheLocation="localstorage"
        skipRedirectCallback={window.location.search.includes('error=')}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Auth0Provider>
    );
  }

  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {renderApp()}
  </StrictMode>
);