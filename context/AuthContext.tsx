'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';

import { authService, SessionUser, ServiceError } from '../services/authService';



export interface User {
  id: number;
  name: string;
  email: string;
  isStaff: boolean;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  
  user: User | null;

  
  accessToken: string | null;

  
  isLoading: boolean;

  
  isLoginOpen: boolean;
  setIsLoginOpen: (open: boolean) => void;

  
  login: (email: string, password: string) => Promise<void>;

  
  signup: (name: string, email: string, password: string) => Promise<void>;

  
  logout: () => Promise<void>;

  
  refreshProfile: () => Promise<void>;
}



function toUser(s: SessionUser): User {
  return {
    id:        s.id,
    name:      s.name,
    email:     s.email,
    isStaff:   s.isStaff,
    isAdmin:   s.isAdmin,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  };
}



const AuthContext = createContext<AuthContextType>({} as AuthContextType);



export function AuthProvider({ children }: { children: ReactNode }) {
  const [user,        setUser]        = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading,   setIsLoading]   = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  
  useEffect(() => {
    authService
      .restoreSession()
      .then((result) => {
        if (result) {
          setUser(toUser(result.user));
          setAccessToken(result.accessToken);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authService.login(email, password); 
    setUser(toUser(result.user));
    setAccessToken(result.accessToken);
    setIsLoginOpen(false);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const result = await authService.register(name, email, password); 
    setUser(toUser(result.user));
    setAccessToken(result.accessToken);
    setIsLoginOpen(false);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout(accessToken);
    setUser(null);
    setAccessToken(null);
  }, [accessToken]);

  const refreshProfile = useCallback(async () => {
    if (!accessToken) return;
    const result = await authService.fetchProfile(accessToken);
    setUser(toUser(result.user));
    if (result.accessToken !== accessToken) {
      setAccessToken(result.accessToken);
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isLoginOpen,
        setIsLoginOpen,
        login,
        signup,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}



export const useAuth = () => useContext(AuthContext);


export function useAuthedFetch() {
  const { accessToken, setIsLoginOpen } = useContext(AuthContext);
  const [, setAccessToken] = useState<string | null>(accessToken);

  return useCallback(
    async <T,>(path: string, options: RequestInit = {}): Promise<T> => {
      if (!accessToken) {
        setIsLoginOpen(true);
        throw { code: 'UNAUTHORIZED', message: 'Not logged in.' } as ServiceError;
      }

      const { data, accessToken: newToken } =
        await authService.authedFetch<T>(accessToken, path, options);

      
      if (newToken !== accessToken) {
        setAccessToken(newToken);
      }

      return data;
    },
    [accessToken, setIsLoginOpen]
  );
}
