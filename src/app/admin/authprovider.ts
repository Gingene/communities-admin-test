import { AuthProvider, fetchUtils } from "ra-core";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Storage keys
const USER_KEY = "user";
const TOKEN_KEY = "access_token";

// Helper: Get user from localStorage
const getUser = () => {
  console.log(process.env.NEXT_PUBLIC_API_URL);
  const userString = localStorage.getItem(USER_KEY);
  if (!userString) return null;
  try {
    return JSON.parse(userString);
  } catch {
    return null;
  }
};

const getToken = (): string | null => {
  try {
    const tokenString = localStorage.getItem(TOKEN_KEY);
    if (!tokenString) return null;
    const token = JSON.parse(tokenString);
    return token ?? null;
  } catch {
    return null;
  }
};

// Helper: Clear all auth data
const clearAuthData = () => {
  localStorage.removeItem(USER_KEY);
};

// Helper: Build fetch options with auth header
const buildAuthOptions = () => {
  const token = getToken();
  if (!token) {
    throw new Error("找不到使用者資料");
  }
  return {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  };
};

export const authProvider: AuthProvider = {
  async login({ email, password }) {
    const { json } = await fetchUtils.fetchJson(`${API_URL}/login`, {
      method: "POST",
      headers: new Headers({ "Content-Type": "application/json" }),
      body: JSON.stringify({ email, password }),
    });

    if (!json.success || !json.data?.access_token) {
      throw new Error(json.message || "登入失敗");
    }

    localStorage.setItem(USER_KEY, JSON.stringify(json.data.user));
    localStorage.setItem(TOKEN_KEY, JSON.stringify(json.data.access_token));
  },

  async logout() {
    clearAuthData();
  },

  async checkError({ status }) {
    if (status === 401 || status === 403) {
      clearAuthData();
      throw new Error("Session expired");
    }
  },

  async checkAuth() {
    const token = getToken();
    if (!token) {
      clearAuthData();
      throw new Error("請登入取得授權");
    }
  },

  async getPermissions() {
    const user = getUser();
    return user?.isAdmin ? "admin" : "user";
  },

  async getIdentity() {
    const { json } = await fetchUtils.fetchJson(
      `${API_URL}/me`,
      buildAuthOptions()
    );

    if (!json.success || !json.data) {
      throw new Error("使用者訊息取得失敗，請重新登入");
    }

    return json.data;
  },
};
