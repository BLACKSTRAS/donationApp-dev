"use client";

import { UserInfoInterface } from "@/constants/models";
import { getUserInfo } from "@/services/users/userInfo";
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserInfoInterface | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getUserInfo();
                // ตรวจสอบว่าได้ข้อมูลจริงๆ
                if (data && data.userName) {
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user:", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
