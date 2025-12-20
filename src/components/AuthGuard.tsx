// src/components/AuthGuard.tsx
// --------------------------------------------------------
// Route Guard - Protects authenticated routes
// --------------------------------------------------------
import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "client" | "admin";
}

// Loading Screen Component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0B1120] dark:to-[#1E293B]">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 rounded-full animate-spin border-t-blue-500 dark:border-t-blue-400 mx-auto" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
        Loading...
      </h2>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Please wait
      </p>
    </motion.div>
  </div>
);

// Access Denied Screen
const AccessDeniedScreen = ({ requiredRole }: { requiredRole: string }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-[#0B1120] dark:to-[#1E293B]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md mx-auto p-8"
      >
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
          Access Denied
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Requires <span className="font-semibold text-blue-500">{requiredRole}</span> role.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-500/25"
        >
          Go Home
        </button>
      </motion.div>
    </div>
  );
};

export const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, loginWithRole, role } = useAuth();
  const location = useLocation();
  
  const isCallbackPage = location.pathname === "/callback";

  useEffect(() => {
    // Skip redirect for callback page
    if (isCallbackPage) return;
    if (isLoading) return;
    
    // If not authenticated, redirect to login with required_role
    if (!isAuthenticated) {
      sessionStorage.setItem("return_url", location.pathname + location.search);
      // ✅ ส่ง required_role ไปใน URL ตามที่ BlackBox กำหนด
      loginWithRole(requiredRole || "all");
    }
  }, [isAuthenticated, isLoading, loginWithRole, location, isCallbackPage, requiredRole]);

  // Skip guard for callback page
  if (isCallbackPage) {
    return <>{children}</>;
  }

  if (isLoading) return <LoadingScreen />;

  // Role check
  if (isAuthenticated && requiredRole && role !== requiredRole) {
    return <AccessDeniedScreen requiredRole={requiredRole} />;
  }

  if (isAuthenticated) return <>{children}</>;
  
  return null;
};

export default AuthGuard;
