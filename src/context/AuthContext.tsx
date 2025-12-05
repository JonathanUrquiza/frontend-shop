import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// URL del backend - usa variable de entorno o fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export type UserRole = 'admin' | 'vendedor' | 'comprador' | 'mixto' | null;

interface User {
    id: number;
    username: string;
    email: string;
    name?: string;
    lastname?: string;
    role: UserRole;
    roleId?: number;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (username: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isVendedor: boolean;
    isComprador: boolean;
    isMixto: boolean;
    role: UserRole;
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
    role: UserRole;
    roleId?: number;
    name?: string;
    lastname?: string;
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
            // Separar nombre y apellido del username
            const nameParts = username.split(' ');
            const name = nameParts[0] || username;
            const lastname = nameParts.slice(1).join(' ') || 'Usuario';

            // Validar longitud de campos según el modelo del backend (validación del lado del cliente)
            if (name.length > 16) {
                return { success: false, message: 'El nombre debe tener máximo 16 caracteres' };
            }
            if (lastname.length > 80) {
                return { success: false, message: 'El apellido debe tener máximo 80 caracteres' };
            }
            if (password.length > 32) {
                return { success: false, message: 'La contraseña debe tener máximo 32 caracteres' };
            }
            if (email.length > 255) {
                return { success: false, message: 'El email debe tener máximo 255 caracteres' };
            }

            // Registrar en el backend (el backend valida si el email ya existe)
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

            let data;
            try {
                data = await response.json();
            } catch (e) {
                // Si la respuesta no es JSON válido
                return { success: false, message: 'Error al procesar la respuesta del servidor' };
            }

            if (!response.ok) {
                // El backend retorna el mensaje de error específico
                return { success: false, message: data.message || 'Error al registrar usuario en el servidor' };
            }

            // Registro exitoso - el backend ya validó que el email no existe y creó el usuario en la BD
            // El backend asigna automáticamente el rol "mixto" a los nuevos usuarios
            // Guardar también localmente para referencia
            const registeredUsers: StoredUser[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const newUser: StoredUser = {
                id: data.user_id || Date.now(), // Usar el ID del backend si está disponible
                username,
                email,
                password,
                role: 'mixto', // Los nuevos usuarios se registran con rol mixto
                roleId: data.role_id || 4 // El backend asigna el role_id del rol mixto
            };

            registeredUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

            // Auto-login después del registro exitoso
            const loggedUser: User = {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                roleId: newUser.roleId
            };

            setUser(loggedUser);
            localStorage.setItem('user', JSON.stringify(loggedUser));

            return { success: true, message: 'Usuario registrado exitosamente' };
        } catch (error: any) {
            console.error('Error al registrar:', error);
            return { success: false, message: 'Error de conexión. Verifica que el servidor esté disponible.' };
        }
    };

    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            // Usuarios de prueba (solo local - para desarrollo)
            // Estos usuarios NO existen en el backend
            if ((username === 'admin' || username === 'admin@funkopop.com') && password === 'admin123') {
                const adminUser: User = {
                    id: 1,
                    username: 'admin',
                    email: 'admin@funkopop.com',
                    name: 'Admin',
                    role: 'admin',
                    roleId: 1
                };
                setUser(adminUser);
                localStorage.setItem('user', JSON.stringify(adminUser));
                return true;
            } else if ((username === 'vendedor' || username === 'vendedor@funkopop.com') && password === 'vendedor123') {
                const vendedorUser: User = {
                    id: 2,
                    username: 'vendedor',
                    email: 'vendedor@funkopop.com',
                    name: 'Vendedor',
                    role: 'vendedor',
                    roleId: 2
                };
                setUser(vendedorUser);
                localStorage.setItem('user', JSON.stringify(vendedorUser));
                return true;
            } else if ((username === 'comprador' || username === 'comprador@funkopop.com') && password === 'comprador123') {
                const compradorUser: User = {
                    id: 3,
                    username: 'comprador',
                    email: 'comprador@funkopop.com',
                    name: 'Comprador',
                    role: 'comprador',
                    roleId: 3
                };
                setUser(compradorUser);
                localStorage.setItem('user', JSON.stringify(compradorUser));
                return true;
            } else if ((username === 'mixto' || username === 'mixto@funkopop.com') && password === 'mixto123') {
                const mixtoUser: User = {
                    id: 4,
                    username: 'mixto',
                    email: 'mixto@funkopop.com',
                    name: 'Mixto',
                    role: 'mixto',
                    roleId: 4
                };
                setUser(mixtoUser);
                localStorage.setItem('user', JSON.stringify(mixtoUser));
                return true;
            } else if ((username === 'user' || username === 'user@funkopop.com') && password === 'user123') {
                const regularUser: User = {
                    id: 5,
                    username: 'user',
                    email: 'user@funkopop.com',
                    name: 'Usuario',
                    role: 'comprador',
                    roleId: 3
                };
                setUser(regularUser);
                localStorage.setItem('user', JSON.stringify(regularUser));
                return true;
            }

            // Determinar si es email o username
            const isEmail = username.includes('@');
            let email = isEmail ? username : '';

            // Si no es email, buscar en usuarios locales para obtener el email
            if (!isEmail) {
                const registeredUsers: StoredUser[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const localUser = registeredUsers.find(u => u.username === username);
                if (localUser) {
                    email = localUser.email;
                } else {
                    // Si no encontramos el usuario localmente y no es email, no podemos hacer login
                    return false;
                }
            }

            // Validar con el backend PRIMERO
            try {
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
                    const data = await response.json();
                    
                    // Determinar el rol basado en role_name del backend
                    let role: UserRole = null;
                    if (data.role_name) {
                        const roleName = data.role_name.toLowerCase();
                        if (roleName === 'admin') {
                            role = 'admin';
                        } else if (roleName === 'vendedor') {
                            role = 'vendedor';
                        } else if (roleName === 'comprador') {
                            role = 'comprador';
                        } else if (roleName === 'mixto') {
                            role = 'mixto';
                        }
                    }

                    const loggedUser: User = {
                        id: data.user_id || Date.now(),
                        username: data.name || email.split('@')[0],
                        email: email,
                        name: data.name,
                        lastname: data.lastname,
                        role: role,
                        roleId: data.role_id
                    };

                    setUser(loggedUser);
                    localStorage.setItem('user', JSON.stringify(loggedUser));
                    return true;
                } else {
                    // El backend rechazó las credenciales
                    return false;
                }
            } catch (error) {
                console.error('Error al validar con el backend:', error);
                // Si el backend no está disponible, intentar con usuarios locales como fallback
                const registeredUsers: StoredUser[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const localUser = registeredUsers.find(u =>
                    (u.username === username || u.email === email) && u.password === password
                );

                if (localUser) {
                    const loggedUser: User = {
                        id: localUser.id,
                        username: localUser.username,
                        email: localUser.email,
                        role: localUser.role || 'comprador',
                        roleId: localUser.roleId
                    };
                    setUser(loggedUser);
                    localStorage.setItem('user', JSON.stringify(loggedUser));
                    return true;
                }

                return false;
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const role = user?.role || null;
    const isAdmin = role === 'admin';
    const isVendedor = role === 'vendedor' || role === 'mixto';
    const isComprador = role === 'comprador' || role === 'mixto';
    const isMixto = role === 'mixto';

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin,
        isVendedor,
        isComprador,
        isMixto,
        role
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
