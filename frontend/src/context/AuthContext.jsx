import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('medtwin_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (username, role) => {
    const newUser = {
      name: username || (role === 'doctor' ? 'Dr. Saubhik Bhaumik' : role === 'admin' ? 'Admin User' : 'Aarav Sharma'),
      role: role || 'patient',
      id: role === 'doctor' ? 'DOC-402' : role === 'admin' ? 'ADM-001' : 'PT-101',
    };
    localStorage.setItem('medtwin_auth_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem('medtwin_auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
