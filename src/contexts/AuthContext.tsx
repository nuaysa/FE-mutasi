"use client";

import { deleteCookie, setCookie } from "cookies-next";
import { useRouter, usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { getProfile, logoutAPI } from "@/api/auth";
import type { LogoutParam } from "@/api/types/types";
import AuthLoading from "@/components/commons/AuthLoading";

type UserProfile = {
  id: string;
  name: string;
  email?: string;
  role: "superadmin" | "admin" | "user";
};

type AuthContextType = {
  afterSuccessLogin: (token: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  clearLogout: () => void;
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isUser: boolean;
  refreshProfile: () => Promise<void>;
  token: string | null;
};

const defaultAuth: AuthContextType = {
  afterSuccessLogin: async () => {},
  logout: async () => {},
  clearLogout: () => {},
  userProfile: null,
  isAuthenticated: false,
  isLoading: true,
  isSuperAdmin: false,
  isAdmin: false,
  isUser: false,
  refreshProfile: async () => {},
  token: null,
};

export const AuthContext = createContext<AuthContextType>(defaultAuth);
export const useAuthContext = () => useContext(AuthContext);

const STORAGE_KEYS = {
  TOKEN: 'anshorussunnah_token',
  REFRESH_TOKEN: 'anshorussunnah_refresh_token',
  EXPIRY: 'anshorussunnah_expiry',
  PROFILE: 'anshorussunnah_profile',
};

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const clearLogout = useCallback(() => {
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
    
    deleteCookie(STORAGE_KEYS.TOKEN);
    setUserProfile(null);
    setIsAuthenticated(true);
    setToken(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await getProfile();
      setUserProfile(profile.data);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile.data));
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  }, []);

  const afterSuccessLogin = useCallback(async (token: string, refreshToken: string) => {
    try {
      const expiredSeconds = 60 * 60 * 24 * 30;
      const expiredDate = new Date(Date.now() + expiredSeconds * 1000);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.EXPIRY, expiredDate.toISOString());
      }
      
      setCookie(STORAGE_KEYS.TOKEN, token, { 
        maxAge: expiredSeconds,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      });

      setToken(token);
      
      const profile = await getProfile();
      setUserProfile(profile.data);
      setIsAuthenticated(true);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile.data));
      }

      const redirectPath = "/";
      router.replace(redirectPath);
      
    } catch (error) {
      console.error('Login error:', error);
      clearLogout();
      throw error;
    }
  }, [router, clearLogout]);


  const logout = useCallback(async () => {
    try {
      const refreshToken = typeof window !== 'undefined' 
        ? localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
        : null;
      
      if (refreshToken) {
        const param: LogoutParam = { refreshToken };
        await logoutAPI(param);
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearLogout();
      router.push('/login');
    }
  }, [router, clearLogout]);

  const { isSuperAdmin, isAdmin, isUser } = useMemo(() => ({
    isSuperAdmin: userProfile?.role === 'superadmin',
    isAdmin: userProfile?.role === 'admin',
    isUser: userProfile?.role === 'user',
  }), [userProfile?.role]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
        const expiry = localStorage.getItem(STORAGE_KEYS.EXPIRY);

        if (!storedToken || (expiry && new Date(expiry) < new Date())) {
          clearLogout();
          setIsLoading(false);
          return;
        }

        if (storedProfile) {
          const profileData = JSON.parse(storedProfile);
          setUserProfile(profileData);
          setIsAuthenticated(true);
          setToken(storedToken);
          setIsLoading(false);
          return;
        }

        const profile = await getProfile();
        setUserProfile(profile.data);
        setIsAuthenticated(true);
        setToken(storedToken);
        
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile.data));

      } catch (error) {
        console.error('Auth check failed:', error);
        clearLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [clearLogout]);

  useEffect(() => {
    if (isLoading || typeof window === 'undefined') return;

    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
    const isPublicPath = publicPaths.some(path => pathname?.startsWith(path));

    if (!isAuthenticated && !isPublicPath) {
      router.push('/login');
    } else if (isAuthenticated && isPublicPath) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, pathname, router, userProfile?.role]);


  const contextValue = useMemo(() => ({
    afterSuccessLogin,
    logout,
    clearLogout,
    userProfile,
    isAuthenticated,
    isLoading,
    isSuperAdmin,
    isAdmin,
    isUser,
    refreshProfile,
    token,
  }), [
    afterSuccessLogin,
    logout,
    clearLogout,
    userProfile,
    isAuthenticated,
    isLoading,
    isSuperAdmin,
    isAdmin,
    isUser,
    refreshProfile,
    token,
  ]);

 if (!hasMounted || isLoading) {
    return <AuthLoading />;
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}