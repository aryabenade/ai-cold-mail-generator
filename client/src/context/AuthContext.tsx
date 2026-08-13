import { createContext, useContext, useEffect, useState } from "react";

interface UserProfile{
    email: string;
    username: string;
}

interface LoginResponse {
   message: string;
   token: string;
   user: UserProfile;
} 

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    login: (apiData: LoginResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem("user");
        if (userInfo) {
            try {
                setUser(JSON.parse(userInfo));
            } catch (error) {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        }
        setLoading(false);
    }, []);

    const login = (apiData: LoginResponse) => {
        localStorage.setItem("user", JSON.stringify(apiData.user));
        localStorage.setItem("token", apiData.token);
        setUser(apiData.user);
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

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
