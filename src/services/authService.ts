// src/services/authService.ts
import storageUtil from "./storageUtil";
import { API_ROUTES } from "../config/apiRoutes";
import apiClient from "./apiClient";

const authService = {
  /* -----------------------------------------------------
     LOGIN
  ----------------------------------------------------- */
  login: async (creds: { userName: string; userPassword: string }) => {
    try {
      console.log("authService: calling authenticate…");

      const resp = await apiClient.post(API_ROUTES.USER.LOGIN, creds);

      if (resp?.data?.success) {
        const token =
          resp.data.token ||
          resp.data?.data?.token ||
          resp.data?.result?.token ||
          null;

        const user =
          resp.data.user ||
          resp.data?.data?.user ||
          resp.data?.result ||
          null;

        const clientId =
          user?.clientId ||
          user?.ClientId ||
          resp.data?.clientId ||
          null;

        await storageUtil.saveSession(token, user);

        if (clientId) {
          await storageUtil.saveClientId(clientId);
        }

        return { success: true, token, user };
      }

      return { success: false, message: "Login failed" };
    } catch (err: any) {
      console.error("authService: login error:", err?.message);
      return { success: false, message: "Unable to connect to server" };
    }
  },

  /* -----------------------------------------------------
     REGISTER
  ----------------------------------------------------- */
  register: async (payload: {
    name: string;
    userName: string;
    userPassword: string;
    mobile?: string;
  }) => {
    try {
      console.log("authService: calling register…", payload);

      const resp = await apiClient.post(
        API_ROUTES.USER.REGISTER,
        payload
      );

      if (resp?.data?.success) {
        return { success: true };
      }

      return {
        success: false,
        message: resp?.data?.message || "Registration failed",
      };
    } catch (err: any) {
      console.error("authService: register error:", err?.message);
      return { success: false, message: "Unable to connect to server" };
    }
  },
};

/* -----------------------------------------------------
   REQUIRED BY apiClient.ts
----------------------------------------------------- */

export async function getToken(): Promise<string | null> {
  const session = await storageUtil.getSession();
  return session?.token ?? null;
}

export async function getAuthData() {
  return await storageUtil.getSession();
}

export async function clearAuth() {
  await storageUtil.clearAll();
}

export default authService;
