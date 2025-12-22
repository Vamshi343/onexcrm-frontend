// // Updated apiClient with safer buildUrl that avoids duplicate "/api" when callers include the prefix.
// // Keeps all original behavior (fetch-based, headers, onUnauthorized handling) but normalizes URLs.
// //
// // Key change:
// // - buildUrl now strips a leading "/api" from the endpoint when the base URL already ends with "/api".
// // - Also normalizes duplicate slashes so "http://host:3500/api" + "/api/auth/login" becomes ".../api/auth/login" (no double "/api")
// //
// // This prevents 404s caused by calling "/api/api/..." when some callers include the "/api" prefix.

// import { Platform } from 'react-native';
// import { storageService } from './storageService';
// import storageUtil from './storageUtil';

// let API_BASE_URL = (function defaultBaseUrl() {
//   if (Platform.OS === 'web' && typeof window !== 'undefined') {
//     const host = window.location.hostname || 'localhost';
//     return `http://${host}:3500/api`;
//   }
//   if (typeof process !== 'undefined') {
//     const env1 = (process.env.REACT_NATIVE_API_URL as string) || (process.env.API_BASE_URL as string) || '';
//     if (env1 && env1.length > 0) return env1;
//   }
//   return Platform.OS === 'android' ? 'http://10.0.2.2:3500/api' : 'http://localhost:3500/api';
// })();

// export function setApiBaseUrl(url: string) {
//   if (url && typeof url === 'string') {
//     API_BASE_URL = url.replace(/\/$/, '');
//     console.log('[apiClient] baseURL overridden ->', API_BASE_URL);
//   }
// }
// export function getApiBaseUrl() { return API_BASE_URL; }

// async function getTokenFromStorage(): Promise<string | null> {
//   try {
//     if (storageService && typeof storageService.getToken === 'function') {
//       const t = await storageService.getToken();
//       if (t) return t;
//     }
//   } catch (e) {
//     if (__DEV__) console.warn('[apiClient] storageService.getToken failed', e);
//   }

//   try {
//     if (storageUtil && typeof storageUtil.getToken === 'function') {
//       const t = await storageUtil.getToken();
//       if (t) return t;
//     }
//   } catch (e) {
//     if (__DEV__) console.warn('[apiClient] storageUtil.getToken failed', e);
//   }

//   return null;
// }

// async function getHeaders(additionalHeaders = {}) {
//   const token = await getTokenFromStorage();
//   const headers: any = {
//     'Content-Type': 'application/json',
//     clientid: '1',
//     ...additionalHeaders,
//   };
//   if (token) headers.Authorization = `Bearer ${token}`;
//   return headers;
// }

// /**
//  * Build final URL by concatenating base + endpoint.
//  * - Avoid duplicate "/api" when base endsWith("/api") and endpoint startsWith("/api").
//  * - Ensure single slash separation and preserve any other path segments.
//  */
// function buildUrl(endpoint: string) {
//   const base = API_BASE_URL.replace(/\/$/, ''); // no trailing slash

//   let path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

//   // If base ends with "/api" and endpoint also starts with "/api", remove the duplicate leading "/api"
//   if (base.toLowerCase().endsWith('/api') && path.toLowerCase().startsWith('/api')) {
//     path = path.replace(/^\/api/i, '');
//     if (!path.startsWith('/')) path = `/${path}`;
//   }

//   // Normalize double slashes (except the "://" part)
//   const combined = `${base}${path}`;
//   const normalized = combined.replace(/([^:]\/)\/+/g, '$1');

//   if (__DEV__) {
//     console.log('[apiClient] buildUrl ->', { base, endpoint, final: normalized });
//   }

//   return normalized;
// }

// async function parseResponse(res: Response) {
//   const text = await res.text().catch(() => '');
//   try { return text ? JSON.parse(text) : {}; } catch { return text; }
// }

// // ----------------------------------------------------------
// // IMPORTANT: central onUnauthorized handler
// // App root can call setOnUnauthorized(fn) to register one handler
// // that runs when a 401 is seen. This avoids multiple components
// // clearing storage/navigating during boot race conditions.
// // ----------------------------------------------------------
// let onUnauthorizedCallback: (() => void | Promise<void> | null) | null = null;
// export function setOnUnauthorized(cb: () => void | Promise<void> | null) {
//   onUnauthorizedCallback = cb;
// }

// async function handleNonOk(res: Response, parsed: any) {
//   if (res.status === 401) {
//     try {
//       if (onUnauthorizedCallback) {
//         try {
//           const ret = onUnauthorizedCallback();
//           const looksLikePromise =
//             (typeof Promise !== 'undefined' && ret instanceof Promise) ||
//             (ret !== null && ret !== undefined && typeof (ret as any)?.then === 'function');

//           if (looksLikePromise) {
//             try {
//               (ret as Promise<any>).catch((e) => {
//                 if (__DEV__) console.warn('[apiClient] onUnauthorized handler promise failed', e);
//               });
//             } catch (e) {
//               if (__DEV__) console.warn('[apiClient] onUnauthorized handler .catch failed', e);
//             }
//           }
//         } catch (e) {
//           if (__DEV__) console.warn('[apiClient] onUnauthorized callback threw', e);
//         }
//       }
//     } catch (e) {
//       if (__DEV__) console.warn('[apiClient] notify unauthorized failed', e);
//     }

//     const err: any = new Error('Unauthorized'); err.unauthorized = true; err.status = 401; err.data = parsed; throw err;
//   }
//   const err: any = new Error(parsed?.message || `HTTP ${res.status}`); err.status = res.status; err.data = parsed; throw err;
// }

// async function logResponse(url: string, method: string, res: Response, parsed: any) {
//   try {
//     if (__DEV__) {
//       console.log(`[apiClient] ${method} ${url} -> status: ${res.status}`, parsed);
//     } else {
//       console.log(`[apiClient] ${method} ${url} -> status: ${res.status}`);
//     }
//   } catch (e) {
//     console.log('[apiClient] response logging error', e);
//   }
// }

// export const apiClient = {
//   get: async (endpoint: string) => {
//     const url = buildUrl(endpoint);
//     const headers = await getHeaders();
//     try {
//       if (__DEV__) console.log(`[apiClient] GET ${url}`);
//       const res = await fetch(url, { method: 'GET', headers });
//       const data = await parseResponse(res);
//       await logResponse(url, 'GET', res, data);
//       if (!res.ok) await handleNonOk(res, data);
//       return data;
//     } catch (error) {
//       console.error(`[apiClient] GET ${url} failed`, error);
//       throw error;
//     }
//   },

//   post: async (endpoint: string, body?: any) => {
//     const url = buildUrl(endpoint);
//     const headers = await getHeaders();
//     try {
//       if (__DEV__ && (endpoint.includes('saveContact') || endpoint.includes('saveLead') || endpoint.includes('saveSubcategory') || endpoint.includes('deleteContact') || endpoint.includes('deleteSubcategory') || endpoint.includes('userChangePassword') || endpoint.includes('/login'))) {
//         console.log('[apiClient] POST debug ->', url, 'body:', body);
//       }
//       const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body ?? {}) });
//       const data = await parseResponse(res);
//       await logResponse(url, 'POST', res, data);
//       if (!res.ok) await handleNonOk(res, data);
//       return data;
//     } catch (error) {
//       console.error(`[apiClient] POST ${url} failed`, error);
//       throw error;
//     }
//   },

//   put: async (endpoint: string, body?: any) => {
//     const url = buildUrl(endpoint);
//     const headers = await getHeaders();
//     try {
//       if (__DEV__) console.log(`[apiClient] PUT ${url}`, body);
//       const res = await fetch(url, { method: 'PUT', headers, body: JSON.stringify(body ?? {}) });
//       const data = await parseResponse(res);
//       await logResponse(url, 'PUT', res, data);
//       if (!res.ok) await handleNonOk(res, data);
//       return data;
//     } catch (error) {
//       console.error(`[apiClient] PUT ${url} failed`, error);
//       throw error;
//     }
//   },

//   del: async (endpoint: string, body?: any) => {
//     const url = buildUrl(endpoint);
//     const headers = await getHeaders();
//     try {
//       if (__DEV__) console.log(`[apiClient] DELETE ${url}`, body);
//       const res = await fetch(url, { method: 'DELETE', headers, body: body ? JSON.stringify(body) : undefined });
//       const data = await parseResponse(res);
//       await logResponse(url, 'DELETE', res, data);
//       if (!res.ok) await handleNonOk(res, data);
//       return data;
//     } catch (error) {
//       console.error(`[apiClient] DELETE ${url} failed`, error);
//       throw error;
//     }
//   },

//   // alias so callers using apiClient.delete(...) still work
//   delete: async (endpoint: string, body?: any) => {
//     return apiClient.del(endpoint, body);
//   }
// };

// export default apiClient;



























// src/services/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL } from "../config/apiRoutes";
import storageUtil from "./storageUtil";

/**
 * Axios instance
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // ✅ Android-safe timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 */
axiosInstance.interceptors.request.use(
  async (config: AxiosRequestConfig | any) => {
    let clientId = 1;

    try {
      const token = await storageUtil.getToken();
      const clientIdStr = await storageUtil.getClientId();

      if (clientIdStr && clientIdStr !== "null" && clientIdStr !== "undefined") {
        const parsed = parseInt(clientIdStr, 10);
        if (!isNaN(parsed)) clientId = parsed;
      }

      config.headers = config.headers || {};

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 🔴 IMPORTANT: send clientid as STRING (Android header bug)
      config.headers.clientid = String(clientId);
    } catch (err) {
      console.warn("[apiClient] Request interceptor fallback");
      config.headers = config.headers || {};
      config.headers.clientid = "1";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;

    console.error("❌ API Error:", {
      url: error?.config?.url,
      status,
      message: error.message,
    });

    if (status === 401) {
      try {
        await storageUtil.clearAll();
      } catch {}
    }

    return Promise.reject(error);
  }
);

/**
 * SIMPLE REQUEST WRAPPER
 * ❌ No inflight dedupe (Android breaks with it)
 */
async function request<T = any>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  switch (method) {
    case "get":
      return axiosInstance.get(url, data);
    case "post":
      return axiosInstance.post(url, data, config);
    case "put":
      return axiosInstance.put(url, data, config);
    case "delete":
      return axiosInstance.delete(url, config);
    default:
      return axiosInstance.request({ method, url, ...(data || {}) });
  }
}

/**
 * EXPORT
 */
const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>("get", url, config),
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>("post", url, data, config),
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    request<T>("put", url, data, config),
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    request<T>("delete", url, undefined, config),
  axios: axiosInstance,
};

export default apiClient;
