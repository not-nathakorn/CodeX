import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const CallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { authenticate } = useAuth();
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (processedRef.current) return;
    processedRef.current = true;

    // Debug logging
    console.log("Callback Page Loaded");
    console.log("Search Params:", searchParams.toString());
    console.log("Hash:", window.location.hash);
    console.log("Full URL:", window.location.href);

    // Helper to get param from search or hash
    const getParam = (name: string) => {
      // Check search params first
      if (searchParams.has(name)) return searchParams.get(name);
      
      // Check hash params
      const hash = window.location.hash.substring(1); // remove #
      const hashParams = new URLSearchParams(hash);
      if (hashParams.has(name)) return hashParams.get(name);
      
      return null;
    };

    const code = getParam('code');
    const token = getParam('token');
    const accessToken = getParam('access_token');
    const idToken = getParam('id_token');

    const hasAuthParams = code || token || accessToken || idToken;

    if (hasAuthParams) {
      console.log("Auth params found, authenticating...");
      // In a real scenario, you would parse the token from the URL here.
      // For now, we assume if the user reaches this page with params, the auth was successful.
      // We set a token in localStorage to persist the session.
      const authToken = token || accessToken || code || 'authenticated';
      
      // Update auth context state
      authenticate(authToken);
      
      // Redirect to the admin dashboard
      navigate('/admin');
    } else {
      // If someone tries to access /admin/callback directly without params (cheating),
      // we redirect them back to the login page or home
      console.error("Security Alert: Invalid callback attempt - No auth params found");
      navigate('/'); 
    }
  }, [navigate, searchParams, authenticate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Authenticating...</h2>
        <p className="text-muted-foreground">Please wait while we log you in.</p>
        <p className="text-xs text-muted-foreground mt-4">Checking credentials...</p>
      </div>
    </div>
  );
};
