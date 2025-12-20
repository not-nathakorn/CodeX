// src/components/AuthGuard.tsx
// --------------------------------------------------------
// Route Guard - Protects authenticated routes
// --------------------------------------------------------
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { AuthLoadingScreen } from "./AuthLoadingScreen";
import { AccessDeniedScreen } from "./AccessDeniedScreen";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "client" | "admin";
}

export const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, login, loginWithRole, role } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Skip guard logic for callback page
    if (location.pathname === "/callback") return;

    if (isLoading) return;
    if (!isAuthenticated) {
      sessionStorage.setItem("return_url", location.pathname + location.search);
      
      if (requiredRole) {
        loginWithRole(requiredRole);
      } else {
        login();
      }
    }
  }, [isAuthenticated, isLoading, login, loginWithRole, location, requiredRole]);

  // Skip guard visual for callback page
  if (location.pathname === "/callback") return <>{children}</>;

  if (isLoading) return <AuthLoadingScreen message="Checking Access..." subtitle="Please wait while we secure your connection" />;

  // Role check
  if (isAuthenticated && requiredRole && role !== requiredRole) {
    return <AccessDeniedScreen requiredRole={requiredRole} />;
  }

  if (isAuthenticated) return <>{children}</>;
  
  return null;
};
