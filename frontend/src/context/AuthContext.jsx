import React, { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Criação do contexto
const AuthContext = createContext();

// Provedor do contexto
export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();

    // Estado de autenticação
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem("loginRealizado") === "true";
    });

    // Estado de informações do usuário
    const [usuarioInfo, setUsuarioInfo] = useState(() => {
        const data = sessionStorage.getItem("usuarioInfo");
        return data ? JSON.parse(data) : null;
    });

    // Função de login
    const login = async (usuario, senha) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_PROXY_BASE_URL}auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuario, senha }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsAuthenticated(true);
                setUsuarioInfo(data);
                sessionStorage.setItem("loginRealizado", "true");
                sessionStorage.setItem("usuarioInfo", JSON.stringify(data));
                toast.success("Login realizado com sucesso!");
                navigate("/home");
            } else {
                toast.error(data.erro || "Usuário ou senha inválidos");
            }
        } catch (err) {
            toast.error("Erro ao tentar realizar login");
        }
    };

    // Função de logout
    const logout = () => {
        setIsAuthenticated(false);
        setUsuarioInfo(null);
        sessionStorage.removeItem("loginRealizado");
        sessionStorage.removeItem("usuarioInfo");
        toast.info("Logout realizado com sucesso!");
        navigate("/login");
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, usuarioInfo }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);
