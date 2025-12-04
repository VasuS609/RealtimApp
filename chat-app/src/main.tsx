//this containt mostly authentication part not related to chat 
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import { BrowserRouter } from 'react-router-dom';

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

// Wrap with Auth0Provider only if credentials are configured
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
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Auth0Provider>
    );
  }

  // If Auth0 not configured, just render app with router
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