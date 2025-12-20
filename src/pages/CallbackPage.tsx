// src/pages/CallbackPage.tsx
// --------------------------------------------------------
// OAuth Callback Handler - SECURE VERSION
// ✅ Exchanges code for tokens
// ✅ Receives HttpOnly Cookies automatically
// ✅ Redirects to dashboard after success
// --------------------------------------------------------
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AUTH_HUB = import.meta.env.VITE_BLACKBOX_AUTH_URL || "https://bbh.codex-th.com";
const CLIENT_ID = import.meta.env.VITE_BLACKBOX_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_BLACKBOX_REDIRECT_URI || window.location.origin + "/callback";

// Error messages in Thai
const ERROR_MESSAGES: Record<string, string> = {
  expired_grant: "รหัสยืนยันตัวตนหมดอายุ กรุณาเข้าสู่ระบบใหม่อีกครั้ง",
  token_exchange_failed: "ไม่สามารถยืนยันตัวตนได้ กรุณาลองใหม่อีกครั้ง",
  callback_failed: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่",
  access_denied: "การเข้าถึงถูกปฏิเสธ",
  invalid_request: "คำขอไม่ถูกต้อง",
};

export default function CallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshAuth, loginWithRole } = useAuth();
  const processedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      const code = searchParams.get("code");
      const authError = searchParams.get("error");

      // Handle errors from OAuth provider
      if (authError) {
        console.error("Auth Error:", authError);
        setError(authError);
        return;
      }

      if (!code) {
        navigate("/");
        return;
      }

      try {
        // ✅ Exchange code for tokens
        const response = await fetch(`${AUTH_HUB}/api/oauth/token`, {
          method: "POST",
          credentials: "include", // ✅ รับ HttpOnly Cookies
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            client_id: CLIENT_ID,
            grant_type: "authorization_code"
          })
        });

        const data = await response.json();

        if (data.success && data.user) {
          // ✅ Refresh context (Cookie ถูก set แล้ว)
          await refreshAuth();
          
          // Redirect to home or original page
          const returnUrl = searchParams.get("state") || "/";
          navigate(returnUrl);
        } else {
          console.error("Token exchange failed:", data);
          // Check for specific error
          const errorType = data.error || "token_exchange_failed";
          setError(errorType);
        }
      } catch (err) {
        console.error("Callback error:", err);
        setError("callback_failed");
      }
    };

    handleCallback();
  }, [searchParams, navigate, refreshAuth]);

  // Handle retry login
  const handleRetry = () => {
    setIsRetrying(true);
    // Redirect to BlackBox Auth login
    loginWithRole("all");
  };

  // Handle go home
  const handleGoHome = () => {
    navigate("/");
  };

  // Show error state
  if (error) {
    const errorMessage = ERROR_MESSAGES[error] || `เกิดข้อผิดพลาด: ${error}`;
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 p-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-slate-700/20 p-8 max-w-md w-full text-center">
          {/* Error Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">
            เข้าสู่ระบบไม่สำเร็จ
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {errorMessage}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              {isRetrying ? "กำลังเปลี่ยนเส้นทาง..." : "เข้าสู่ระบบใหม่"}
            </button>
            
            <button
              onClick={handleGoHome}
              className="w-full px-6 py-3 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
            >
              กลับหน้าหลัก
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="text-center">
        {/* Loading Spinner */}
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          กำลังดำเนินการ...
        </h2>
        <p className="text-slate-500 dark:text-slate-400">กรุณารอสักครู่</p>
      </div>
    </div>
  );
}

