import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// URL del backend - usa variable de entorno o fallback
const API_URL = process.env.REACT_APP_API_URL || 'https://backend-shop-3btv.onrender.com';

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
        try {
            // Verificar primero en localStorage (usuarios locales)
            const registeredUsers: StoredUser[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const userExists = registeredUsers.some(u => u.username === username || u.email === email);

            if (userExists) {
                return { success: false, message: 'El usuario o email ya está registrado localmente' };
            }

            // Separar nombre y apellido del username
            const nameParts = username.split(' ');
            const name = nameParts[0] || username;
            const lastname = nameParts.slice(1).join(' ') || 'Usuario';

            // Registrar en el backend
            const formData = new URLSearchParams();
            formData.append('name', name);
            formData.append('lastname', lastname);
            formData.append('email', email);
            formData.append('password', password);

            const response = await fetch(`${API_URL}/useraccount/register/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            });

            const data = await response.json();

            if (!response.ok) {
                return { success: false, message: data.message || 'Error al registrar usuario en el servidor' };
            }

            // Guardar también localmente
            const newUser: StoredUser = {
                id: registeredUsers.length + 3,
                username,
                email,
                password,
                isAdmin: false
            };

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

            return { success: true, message: 'Usuario registrado exitosamente' };
        } catch (error) {
            console.error('Error al registrar:', error);
            return { success: false, message: 'Error de conexión. Verifica que el servidor esté disponible.' };
        }
    };

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            // Usuarios admin de prueba (solo local)
            if ((username === 'admin' || username === 'admin@funkopop.com') && password === 'admin123') {
                const adminUser: User = {
                    id: 1,
                    username: 'admin',
                    email: 'admin@funkopop.com',
                    isAdmin: true
                };
                setUser(adminUser);
                localStorage.setItem('user', JSON.stringify(adminUser));
                return true;
            } else if ((username === 'user' || username === 'user@funkopop.com') && password === 'user123') {
                const regularUser: User = {
                    id: 2,
                    username: 'user',
                    email: 'user@funkopop.com',
                    isAdmin: false
                };
                setUser(regularUser);
                localStorage.setItem('user', JSON.stringify(regularUser));
                return true;
            }

            // Determinar si es email o username
            const isEmail = username.includes('@');
            let email = isEmail ? username : '';

            // Verificar en usuarios registrados localmente
            const registeredUsers: StoredUser[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const localUser = registeredUsers.find(u =>
                (u.username === username || u.email === username) && u.password === password
            );

            if (localUser) {
                email = localUser.email;

                // Intentar validar también con el backend
                try {
                    const formData = new URLSearchParams();
                    formData.append('email', email);
                    formData.append('password', password);

                    await fetch(`${API_URL}/useraccount/login/`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: formData.toString()
                    });
                } catch (err) {
                    console.warn('Backend login falló, continuando con sesión local:', err);
                }

                // Login exitoso (local)
                const loggedUser: User = {
                    id: localUser.id,
                    username: localUser.username,
                    email: localUser.email,
                    isAdmin: localUser.isAdmin
                };
                setUser(loggedUser);
                localStorage.setItem('user', JSON.stringify(loggedUser));
                return true;
            }

            // Si no está local, intentar solo con backend (solo si es email)
            if (isEmail) {
                const formData = new URLSearchParams();
                formData.append('email', email);
                formData.append('password', password);

                const response = await fetch(`${API_URL}/useraccount/login/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formData.toString()
                });

                if (response.ok) {
                    // Login exitoso desde backend
                    const newUser: User = {
                        id: Date.now(),
                        username: email.split('@')[0],
                        email: email,
                        isAdmin: false
                    };
                    setUser(newUser);
                    localStorage.setItem('user', JSON.stringify(newUser));
                    return true;
                }
            }

            return false;
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return false;
        }
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
