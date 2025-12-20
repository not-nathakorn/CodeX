// src/utils/auth.ts
// --------------------------------------------------------
// BlackBox Auth Utility - SECURE VERSION (HttpOnly Cookie)
// ✅ Uses HttpOnly Cookies for Session Persistence
// ✅ Token auto-refresh on 401
// ✅ Survives page refresh without re-login
// --------------------------------------------------------

const AUTH_HUB = "https://bbh.codex-th.com";

export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: "client" | "admin";
}

// ✅ Check Auth - Uses HttpOnly Cookie (survives page refresh)
export const checkAuth = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${AUTH_HUB}/api/user/profile`, {
      method: "GET",
      credentials: "include", // ✅ สำคัญ! ส่ง HttpOnly Cookie อัตโนมัติ
      headers: { "Content-Type": "application/json" }
    });
    
    if (!response.ok) {
      // Session หมดอายุ - ลอง Refresh Token
      const refreshed = await refreshSession();
      if (refreshed) {
        // Retry หลังจาก refresh สำเร็จ
        const retryResponse = await fetch(`${AUTH_HUB}/api/user/profile`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        if (retryResponse.ok) {
          const data = await retryResponse.json();
          return data.user;
        }
      }
      return null;
    }
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error("Auth check failed:", error);
    return null;
  }
};

// ✅ Refresh Session - Uses Refresh Token from HttpOnly Cookie
export const refreshSession = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${AUTH_HUB}/api/user/refresh`, {
      method: "POST",
      credentials: "include", // ✅ Browser ส่ง bb_refresh_token Cookie
      headers: { "Content-Type": "application/json" }
    });
    return response.ok;
  } catch {
    return false;
  }
};

// Logout - Clear server session
export const logout = async (): Promise<void> => {
  try {
    await fetch(`${AUTH_HUB}/api/auth/logout`, {
      method: "POST",
      credentials: "include"
    });
  } finally {
    window.location.href = "/";
  }
};

// Update profile (username, phone)
export const updateProfile = async (
  data: { username?: string; phone?: string }
): Promise<{ success: boolean; user?: User; error?: string }> => {
  try {
    const response = await fetch(`${AUTH_HUB}/api/user/profile`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) return { success: false, error: result.error };
    return { success: true, user: result.user };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
};

// Change password
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${AUTH_HUB}/api/user/password`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
    });
    const data = await response.json();
    if (!response.ok) return { success: false, error: data.error };
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: errorMessage };
  }
};
