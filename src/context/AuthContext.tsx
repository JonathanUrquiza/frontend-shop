import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

interface StoredUser {
    id: number;
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Cargar usuario desde localStorage al iniciar
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const register = async (username: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Obtener usuarios registrados
                const registeredUsers: StoredUser[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

                // Verificar si el usuario o email ya existe
                const userExists = registeredUsers.some(u => u.username === username || u.email === email);

                if (userExists) {
                    resolve({ success: false, message: 'El usuario o email ya está registrado' });
                    return;
                }

                // Crear nuevo usuario
                const newUser: StoredUser = {
                    id: registeredUsers.length + 3, // +3 para no conflictuar con usuarios de prueba
                    username,
                    email,
                    password,
                    isAdmin: false
                };

                // Guardar en la lista de usuarios registrados
                registeredUsers.push(newUser);
                localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

                // Auto-login después del registro
                const loggedUser: User = {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    isAdmin: newUser.isAdmin
                };

                setUser(loggedUser);
                localStorage.setItem('user', JSON.stringify(loggedUser));

                resolve({ success: true, message: 'Usuario registrado exitosamente' });
            }, 500);
        });
    };

    const login = async (username: string, password: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Usuarios de prueba predefinidos
                if ((username === 'admin' || username === 'admin@funkopop.com') && password === 'admin123') {
                    const adminUser: User = {
                        id: 1,
                        username: 'admin',
                        email: 'admin@funkopop.com',
                        isAdmin: true
                    };
                    setUser(adminUser);
                    localStorage.setItem('user', JSON.stringify(adminUser));
                    resolve(true);
                    return;
                } else if ((username === 'user' || username === 'user@funkopop.com') && password === 'user123') {
                    const regularUser: User = {
                        id: 2,
                        username: 'user',
                        email: 'user@funkopop.com',
                        isAdmin: false
                    };
                    setUser(regularUser);
                    localStorage.setItem('user', JSON.stringify(regularUser));
                    resolve(true);
                    return;
                }

                // Verificar usuarios registrados
                const registeredUsers: StoredUser[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const foundUser = registeredUsers.find(u =>
                    (u.username === username || u.email === username) && u.password === password
                );

                if (foundUser) {
                    const loggedUser: User = {
                        id: foundUser.id,
                        username: foundUser.username,
                        email: foundUser.email,
                        isAdmin: foundUser.isAdmin
                    };
                    setUser(loggedUser);
                    localStorage.setItem('user', JSON.stringify(loggedUser));
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 500);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
