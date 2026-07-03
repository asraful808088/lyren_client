

import { authApi, ApiUser, ApiError } from './authApi';



const ACCESS_KEY  = 'auth_access_token';
const REFRESH_KEY = 'auth_refresh_token';



export interface SessionUser {
  id: number;
  name: string;
  email: string;
  isStaff: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResult {
  user: SessionUser;
  accessToken: string;
}

export interface ServiceError {
  code: 'UNAUTHORIZED' | 'CONFLICT' | 'VALIDATION' | 'NETWORK' | 'UNKNOWN';
  message: string;
}



function mapUser(u: ApiUser): SessionUser {
  return {
    id:        u.id,
    name:      u.name,
    email:     u.email,
    isStaff:   u.isStaff,
    isAdmin:   u.isAdmin,
    createdAt: u.createTime,
    updatedAt: u.updateTime,
  };
}

function toServiceError(err: unknown): ServiceError {
  const e = err as ApiError;
  if (e?.status === 401) return { code: 'UNAUTHORIZED', message: e.message };
  if (e?.status === 409) return { code: 'CONFLICT',     message: e.message ?? 'Email already in use.' };
  if (e?.status === 400) return { code: 'VALIDATION',   message: e.message ?? 'Invalid request.' };
  if (err instanceof TypeError) return { code: 'NETWORK', message: 'Cannot reach server. Check your connection.' };
  return { code: 'UNKNOWN', message: e?.message ?? 'Something went wrong.' };
}



const tokenStore = {
  getAccess():  string | null { return localStorage.getItem(ACCESS_KEY);  },
  getRefresh(): string | null { return localStorage.getItem(REFRESH_KEY); },

  save(access: string, refresh: string) {
    localStorage.setItem(ACCESS_KEY,  access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },

  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};



let refreshInFlight: Promise<string> | null = null;

async function silentRefresh(expiredAccessToken: string): Promise<string> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refresh = tokenStore.getRefresh();
    if (!refresh) {
      tokenStore.clear();
      throw { code: 'UNAUTHORIZED', message: 'Session expired. Please log in again.' } as ServiceError;
    }

    try {
      
      const res = await authApi.refreshToken({ refreshToken: refresh }, expiredAccessToken);
      tokenStore.save(res.accessToken, res.refreshToken);
      return res.accessToken;
    } catch (err) {
      tokenStore.clear();
      throw toServiceError(err);
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}



export const authService = {

 
  async restoreSession(): Promise<AuthResult | null> {
    const token = tokenStore.getAccess();
    if (!token) return null;

   
    try {
      const user = await authApi.getMe(token);
      return { user: mapUser(user), accessToken: token };
    } catch (err) {
      if ((err as ApiError)?.status !== 401) return null;
    }

    
    try {
      const newToken = await silentRefresh(token);
      const user     = await authApi.getMe(newToken);
      return { user: mapUser(user), accessToken: newToken };
    } catch {
      return null;
    }
  },

  
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      const res = await authApi.login({ email, password });
      tokenStore.save(res.accessToken, res.refreshToken);
      return { user: mapUser(res.user), accessToken: res.accessToken };
    } catch (err) {
      throw toServiceError(err);
    }
  },


  async register(name: string, email: string, password: string): Promise<AuthResult> {
    try {
      const res = await authApi.register({ name, email, password });
      tokenStore.save(res.accessToken, res.refreshToken);
      return { user: mapUser(res.user), accessToken: res.accessToken };
    } catch (err) {
      throw toServiceError(err);
    }
  },

 
  async logout(accessToken: string | null): Promise<void> {
    try {
      await authApi.logout(accessToken);
    } finally {
      tokenStore.clear();
    }
  },

  
  async fetchProfile(accessToken: string): Promise<AuthResult> {
    try {
      const user = await authApi.getProfile(accessToken);
      return { user: mapUser(user), accessToken };
    } catch (err) {
      if ((err as ApiError)?.status !== 401) throw toServiceError(err);

      const newToken = await silentRefresh(accessToken);
      const user     = await authApi.getProfile(newToken);
      return { user: mapUser(user), accessToken: newToken };
    }
  },

 
  async authedFetch<T>(
    accessToken: string,
    path: string,
    options: RequestInit = {}
  ): Promise<{ data: T; accessToken: string }> {
    const BASE_URL = 'http://localhost:5036';

    const doFetch = (token: string) =>
      fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers as Record<string, string>),
          Authorization: `Bearer ${token}`,
        },
      });

    let res = await doFetch(accessToken);

 
    if (res.status === 401) {
      const newToken = await silentRefresh(accessToken);
      res = await doFetch(newToken);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw toServiceError({ status: res.status, message: (body as { message?: string }).message });
      }

      return { data: await res.json() as T, accessToken: newToken };
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw toServiceError({ status: res.status, message: (body as { message?: string }).message });
    }

    return { data: await res.json() as T, accessToken };
  },

  getStoredAccessToken(): string | null {
    return tokenStore.getAccess();
  },
};
