// src/services/storageUtil.ts
import { Platform } from "react-native";

let AsyncStorage: any = null;
try {
  // @ts-ignore – loaded only in native
  AsyncStorage = require("@react-native-async-storage/async-storage").default;
} catch (e) {
  AsyncStorage = null;
}

// Main session key
const KEY_SESSION = "@onex9crm";

// NEW: clientId key
const KEY_CLIENT_ID = "@onex9crm_clientId";

// Optional pending actions key
const KEY_PENDING = "@onex9_pending_actions_v1";

/* --------------------------------------------------------
   Low-level helpers
-------------------------------------------------------- */

async function storageSet(key: string, value: string) {
  try {
    if (AsyncStorage) {
      await AsyncStorage.setItem(key, value);
    } else if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn("[storageUtil] set failed", e);
  }
}

async function storageGet(key: string) {
  try {
    if (AsyncStorage) {
      return await AsyncStorage.getItem(key);
    } else if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  } catch (e) {
    console.warn("[storageUtil] get failed", e);
    return null;
  }
}

async function storageRemove(key: string) {
  try {
    if (AsyncStorage) {
      await AsyncStorage.removeItem(key);
    } else if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn("[storageUtil] remove failed", e);
  }
}

/* --------------------------------------------------------
   High-level session helpers
   Session: { token: string | null, user: any | null }
-------------------------------------------------------- */

const saveSession = async (token: string | null, user: any | null) => {
  const payload = {
    token: token ?? null,
    user: user ?? null,
  };

  try {
    await storageSet(KEY_SESSION, JSON.stringify(payload));

    // NEW: Save clientId automatically if exists inside user
    if (user?.clientId) {
      await storageSet(KEY_CLIENT_ID, String(user.clientId));
    }
  } catch (e) {
    console.warn("[storageUtil] saveSession stringify failed", e);
  }
};

const getSession = async (): Promise<
  { token: string | null; user: any | null } | null
> => {
  const raw = await storageGet(KEY_SESSION);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token ?? null,
      user: parsed?.user ?? null,
    };
  } catch (e) {
    console.warn("[storageUtil] getSession parse failed", e);
    return null;
  }
};

const getToken = async (): Promise<string | null> => {
  const session = await getSession();
  return session?.token ?? null;
};

const getUser = async (): Promise<any | null> => {
  const session = await getSession();
  return session?.user ?? null;
};

/* --------------------------------------------------------
   NEW: Client ID helpers
-------------------------------------------------------- */

const saveClientId = async (id: number | string) => {
  await storageSet(KEY_CLIENT_ID, String(id));
};

const getClientId = async (): Promise<string | null> => {
  return await storageGet(KEY_CLIENT_ID);
};

/* --------------------------------------------------------
   Clear All
-------------------------------------------------------- */

const clearAll = async () => {
  await storageRemove(KEY_SESSION);
  await storageRemove(KEY_CLIENT_ID);
  await storageRemove(KEY_PENDING);
};

const isAuthenticated = async () => {
  const t = await getToken();
  return !!t;
};

export default {
  saveSession,
  getSession,
  getToken,
  getUser,
  clearAll,
  isAuthenticated,

  // NEW
  saveClientId,
  getClientId,
};
