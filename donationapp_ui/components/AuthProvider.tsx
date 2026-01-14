"use client";

import { UserInfoInterface } from "@/constants/models";
import { getUserInfo } from "@/services/users/userInfo";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

type AuthContextType = {
  user: UserInfoInterface | null;
  setUser: (user: UserInfoInterface | null) => void;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfoInterface | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 🔴 ดึง user จาก backend ใหม่เสมอ (no-cache)
   */
  const refreshUser = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUserInfo();

      if (data && data.userName) {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 🔴 run ตอน mount + หลัง router.refresh()
   */
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        refreshUser, // ⭐ expose
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
