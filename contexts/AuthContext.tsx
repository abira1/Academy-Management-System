
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { auth } from '../services/firebase';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const userCredentials = await auth.signInWithUsernameAndPassword(username, password);
      if (userCredentials) {
        setUser(userCredentials);
        switch (userCredentials.role) {
            case 'admin':
                navigate('/admin/dashboard');
                break;
            case 'reception':
                navigate('/reception/dashboard');
                break;
            case 'partner':
                navigate('/partner/dashboard');
                break;
            default:
                navigate('/login');
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
