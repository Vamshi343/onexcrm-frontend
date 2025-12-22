// // src/services/storageService.ts
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const AUTH_KEY = '@onex9crm';

// export const storageService = {
//   // Save token and user together
//   saveAuthData: async (token: string, user: any) => {
//     const payload = { token, user };
//     await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(payload));
//   },

//   // Convenience alias used by some files
//   getAuthData: async () => {
//     const raw = await AsyncStorage.getItem(AUTH_KEY);
//     if (!raw) return null;
//     try {
//       return JSON.parse(raw);
//     } catch {
//       return null;
//     }
//   },

//   // Return user object only
//   getUser: async () => {
//     const data = await storageService.getAuthData();
//     return data?.user ?? null;
//   },

//   // Return token only
//   getToken: async () => {
//     const data = await storageService.getAuthData();
//     return data?.token ?? null;
//   },

//   // Boolean
//   isAuthenticated: async () => {
//     const token = await storageService.getToken();
//     return !!token;
//   },

//   // Clear storage
//   clear: async () => {
//     await AsyncStorage.removeItem(AUTH_KEY);
//   },

//   // Some files call clearAll — provide alias
//   clearAll: async () => {
//     await storageService.clear();
//   },
// };

























import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = '@onex9crm';

export const storageService = {
  /**
   * Accept either (token, user) or ({ token, user })
   */
  setAuthData: async (arg1: any, arg2?: any) => {
    let payload: { token?: string; user?: any } = { token: undefined, user: undefined };

    if (typeof arg1 === 'string') {
      payload.token = arg1;
      payload.user = arg2;
    } else if (arg1 && typeof arg1 === 'object') {
      payload = {
        token: arg1.token,
        user: arg1.user,
      };
    }

    try {
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(payload));
      console.log('storageService: setAuthData successful', payload?.user?.userName ?? '<no-user>');
    } catch (err) {
      console.error('storageService: setAuthData error', err);
      throw err;
    }
  },

  // Backwards-compatible alias
  saveAuthData: async (token: string, user: any) => {
    await storageService.setAuthData(token, user);
  },

  getAuthData: async () => {
    try {
      const raw = await AsyncStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      console.error('storageService: getAuthData parse error', err);
      return null;
    }
  },

  getUser: async () => {
    const data = await storageService.getAuthData();
    return data?.user ?? null;
  },

  getToken: async () => {
    const data = await storageService.getAuthData();
    return data?.token ?? null;
  },

  isAuthenticated: async () => {
    const token = await storageService.getToken();
    return !!token;
  },

  clear: async () => {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
      console.log('storageService: cleared auth key');
    } catch (err) {
      console.error('storageService: clear error', err);
    }
  },

  clearAll: async () => {
    await storageService.clear();
  },
};