import { createContext, useEffect, useState } from "react";

interface AuthContextType {
    user: any;
    loading: boolean;
    login: (userData: any) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem("user");
        if (userInfo) {
            try {
                setUser(JSON.parse(userInfo));
            } catch (error) {
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    const login = (userData: any) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);
        setUser(userData);
    }

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    )





}
