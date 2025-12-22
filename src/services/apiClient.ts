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
 * Typed axios instance with request/response interceptors
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR - Fixed to properly handle clientId
axiosInstance.interceptors.request.use(
  async (config: AxiosRequestConfig | any): Promise<AxiosRequestConfig | any> => {
    try {
      // Remove optional chaining ?.() which can cause issues
      const token = await storageUtil.getToken();
      const clientIdStr = await storageUtil.getClientId();

      // console.log('🔍 [apiClient] Retrieved from storage:', { 
      //   token: token ? 'exists' : 'null', 
      //   clientIdStr,
      //   clientIdType: typeof clientIdStr 
      // });

      // Parse clientId properly - convert string to number
      let clientId: number;
      if (clientIdStr && clientIdStr !== 'null' && clientIdStr !== 'undefined') {
        clientId = parseInt(clientIdStr, 10);
        // Check if parsing was successful
        if (isNaN(clientId)) {
          console.warn('[apiClient] clientId parse failed, using default 1');
          clientId = 1;
        }
      } else {
        console.warn('[apiClient] No clientId in storage, using default 1');
        clientId = 1;
      }

      console.log('🔍 [apiClient] Final clientId:', clientId, 'Type:', typeof clientId);

      // Initialize headers if not exists
      config.headers = config.headers || {};

      // Set Authorization header
      if (token) {
        // @ts-ignore - Axios header typing can be loose here
        config.headers.Authorization = `Bearer ${token}`;
      }

      // CRITICAL: Set clientid header as NUMBER (not string)
      // @ts-ignore
      config.headers.clientid = clientId;

      // console.log('📤 [apiClient] Request headers:', {
      //   url: config.url,
      //   method: config.method,
      //   clientid: config.headers.clientid,
      //   hasAuth: !!config.headers.Authorization
      // });

    } catch (e) {
      console.error("[apiClient] Error in request interceptor:", e);
      // Fallback: set default clientId even on error
      config.headers = config.headers || {};
      // @ts-ignore
      config.headers.clientid = 1;
      console.warn("[apiClient] Using fallback clientId: 1");
    }

    return config;
  },
  (error) => {
    console.error("[apiClient] Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    // console.log('✅ [apiClient] Response:', {
    //   url: response.config.url,
    //   status: response.status,
    //   dataCount: response.data?.dataCount,
    //   success: response.data?.success
    // });
    return response;
  },
  async (error) => {
    const status = error?.response?.status;
    
    console.error('❌ [apiClient] Response error:', {
      url: error.config?.url,
      status,
      message: error.message,
      data: error.response?.data
    });

    if (status === 401) {
      console.warn('[apiClient] 401 Unauthorized - clearing storage');
      try {
        await storageUtil.clearAll();
      } catch (e) {
        console.warn("[apiClient] Failed to clear storage:", e);
      }
    }

    return Promise.reject(error);
  }
);

// ---------------------------
// Inflight dedupe + logging
// ---------------------------

const inflight = new Map<string, Promise<AxiosResponse<any>>>();

function buildKey(method: string, url: string, dataOrConfig?: any): string {
  let body = "";
  try {
    if (method.toLowerCase() === "get") {
      const params = dataOrConfig?.params ?? dataOrConfig;
      if (params !== undefined) body = JSON.stringify(params);
    } else {
      if (dataOrConfig !== undefined) body = JSON.stringify(dataOrConfig);
    }
  } catch {
    try {
      body = String(dataOrConfig);
    } catch {
      body = "";
    }
  }
  return `${method.toUpperCase()}|${url}|${body}`;
}

function getCallerStack(): string {
  const err = new Error();
  if (!err.stack) return "";
  const lines = err.stack.split("\n").slice(3, 9);
  return lines.join("\n");
}

async function request(
  method: "get" | "post" | "put" | "delete",
  url: string,
  dataOrConfig?: any,
  configFallback?: AxiosRequestConfig
): Promise<AxiosResponse<any>> {
  const isGet = method.toLowerCase() === "get";
  const key = buildKey(method, url, isGet ? dataOrConfig : dataOrConfig);

  // Debug logging
  try {
    // console.debug(`[apiClient] ${method.toUpperCase()} ${url} key=${key}`);
    // console.debug(getCallerStack());
  } catch {}

  if (inflight.has(key)) {
    console.debug(`[apiClient] Reusing inflight request for key=${key}`);
    return inflight.get(key) as Promise<AxiosResponse<any>>;
  }

  const p: Promise<AxiosResponse<any>> = (async () => {
    try {
      if (method === "get") return await axiosInstance.get(url, dataOrConfig);
      if (method === "post") return await axiosInstance.post(url, dataOrConfig, configFallback);
      if (method === "put") return await axiosInstance.put(url, dataOrConfig, configFallback);
      if (method === "delete") return await axiosInstance.delete(url, dataOrConfig);
      return await axiosInstance.request({ method, url, ...(dataOrConfig || {}) });
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, p);
  return p;
}

// Export same shape as your previous apiClient
const apiClient = {
  get: (url: string, config?: AxiosRequestConfig) => request("get", url, config),
  post: (url: string, data?: any, config?: AxiosRequestConfig) => request("post", url, data, config),
  put: (url: string, data?: any, config?: AxiosRequestConfig) => request("put", url, data, config),
  delete: (url: string, config?: AxiosRequestConfig) => request("delete", url, config),
  axios: axiosInstance,
};

export default apiClient;