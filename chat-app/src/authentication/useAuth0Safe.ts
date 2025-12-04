import { useAuth0 as useAuth0Original } from "@auth0/auth0-react";

/**
 * Safe wrapper around useAuth0 that provides default values if Auth0 is not configured
 */
export const useAuth0 = () => {
  try {
    return useAuth0Original();
  } catch {
    // Auth0Provider not available, return default/mock values
    return {
      isAuthenticated: false,
      isLoading: false,
      error: null,
      user: undefined,
      loginWithRedirect: () => console.warn("Auth0 not configured"),
      logout: () => console.warn("Auth0 not configured"),
      getAccessTokenSilently: async () => "",
      getIdTokenClaims: async () => undefined,
      checkSession: async () => {},
    } as any;
  }
};
