import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          const data = await authService.me();
          setUser(data.user);
          setOrganization(data.organization);
        } catch {
          authService.logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    setOrganization(data.organization);
    return data;
  };

  const register = async (name, email, password, companyName) => {
    const data = await authService.register(name, email, password, companyName);
    setUser(data.user);
    setOrganization(data.organization);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setOrganization(null);
  };

  return (
    <AuthContext.Provider value={{ user, organization, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);