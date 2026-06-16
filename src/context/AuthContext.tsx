import { autenticacaoApi } from "@/services/api";
import React, { createContext, useContext, useState, useEffect } from "react";

type User = {
  id?: number;
  nome: string;
  email: string;
  numTelefone: string;
  codPerfil: number;
  token?: string;
};

// type RequestLogin = {
//   user: User;
// }

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAdmin: boolean;
  isGuia: boolean;
  isUser: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const storedToken = localStorage.getItem("token");
      const storedTime = localStorage.getItem("tempoSessao");
      if (storedUser && storedToken && storedTime) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (error) {
      console.warn("Erro ao ler daods do localStorage:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const userRequisicao = {
        email: email,
        senha: password,
      }

      const response: User = await autenticacaoApi.post("/login", userRequisicao, { skipAuth: true });
      console.log(!response);
      
      if (!response || !response.token) {
        throw new Error("Houve algum erro inesperado no login. Tente mais tarde");
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response));
      localStorage.setItem("tempoSessao", Date.now().toString());

      const userData: User = {
        id: response.id,
        nome: response.nome,
        email: response.email,
        numTelefone: response.numTelefone,
        codPerfil: response.codPerfil,
      };
      setUser(userData);
      setToken(response.token)

      return userData;
    } catch (error) {
      console.error("Erro no login:", error);
      logout()
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("tempoSessao");
  };

  const value = {
    user,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    token,
    isAdmin: user?.codPerfil === 1,
    isGuia: user?.codPerfil === 2,
    isUser: user?.codPerfil === 3,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
