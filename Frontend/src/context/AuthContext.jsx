import {createContext, useContext, useState} from 'react';
import api from "../services/api";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const navigate = useNavigate();

    const[accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);

    const[user, setUser] = useState(() => {
        // Restore user data from localStorage on initialization
        const savedUser = localStorage.getItem("user");
        
        // If we have a token but no user data, create a default user object
        const token = localStorage.getItem("accessToken");
        if (token && !savedUser) {
            console.log('AuthContext Debug - Creating default user for existing token');
            const defaultUser = { username: 'User' }; // You can customize this
            localStorage.setItem("user", JSON.stringify(defaultUser));
            return defaultUser;
        }
        
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(false);



    const login = async (username, password) => {
        setLoading(true);
        try{
            const res = await api.post("/token/", {username, password});
            const {access, refresh} = res.data;

            setAccessToken(access);
            setRefreshToken(refresh);
            localStorage.setItem("accessToken", access);
            localStorage.setItem("refreshToken", refresh);

            const userData = {username};
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
            navigate("/profile");
        }
        catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const value = {
        user,
        accessToken,
        refreshToken,
        loading,
        login,
        logout,
        isAuthenticated: !!accessToken
    };

    return (
        <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    return useContext(AuthContext);
}
