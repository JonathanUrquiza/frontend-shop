/**
 * Componente Register - Página de registro de nuevos usuarios.
 * 
 * Este componente permite a usuarios nuevos crear una cuenta en el sistema.
 * Maneja el formulario de registro, validaciones del lado del cliente y
 * redirección después del registro exitoso.
 * 
 * Características:
 * - Formulario con username, email, password y confirmación de password
 * - Validaciones del lado del cliente antes de enviar al backend
 * - Auto-login después del registro exitoso
 * - Redirección automática a la página de productos
 * - Manejo de errores y estados de carga
 */

// Importar React y hooks necesarios
import React, { useState, FormEvent } from 'react';
// Importar hooks de react-router-dom para navegación
import { useNavigate, Link } from 'react-router-dom';
// Importar hook useAuth del contexto de autenticación
import { useAuth } from '../context/AuthContext';

/**
 * Componente funcional Register.
 * 
 * Renderiza un formulario de registro que permite crear nuevas cuentas.
 * 
 * @returns {JSX.Element} Componente de registro con formulario y validaciones
 */
const Register: React.FC = () => {
    // Estado para almacenar el nombre de usuario ingresado
    const [username, setUsername] = useState('');
    
    // Estado para almacenar el email ingresado
    const [email, setEmail] = useState('');
    
    // Estado para almacenar la contraseña ingresada
    const [password, setPassword] = useState('');
    
    // Estado para almacenar la confirmación de contraseña
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Estado para almacenar mensajes de error
    const [error, setError] = useState('');
    
    // Estado para indicar si se está procesando el registro
    const [loading, setLoading] = useState(false);
    
    // Hook para navegar programáticamente a otras rutas
    const navigate = useNavigate();
    
    // Obtener función register del contexto de autenticación
    const { register } = useAuth();

    /**
     * Maneja el envío del formulario de registro.
     * 
     * Esta función se ejecuta cuando el usuario hace submit del formulario.
     * Valida los datos del lado del cliente, llama al backend para registrar
     * y maneja la respuesta.
     * 
     * @param {FormEvent} e - Evento del formulario (para prevenir recarga)
     */
    const handleSubmit = async (e: FormEvent) => {
        // Prevenir el comportamiento por defecto del formulario (recarga de página)
        e.preventDefault();
        
        // Limpiar cualquier error previo
        setError('');

        // Validaciones del lado del cliente antes de enviar al backend
        // Esto mejora la experiencia del usuario al dar feedback inmediato
        
        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;  // Detener el proceso si no coinciden
        }

        // Validar longitud mínima de contraseña
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;  // Detener el proceso si es muy corta
        }

        // Validar formato básico de email (debe contener @)
        if (!email.includes('@')) {
            setError('Por favor ingresa un email válido');
            return;  // Detener el proceso si el email es inválido
        }

        // Validar longitud mínima del nombre de usuario
        if (username.length < 3) {
            setError('El nombre de usuario debe tener al menos 3 caracteres');
            return;  // Detener el proceso si es muy corto
        }

        // Si pasan todas las validaciones, activar estado de carga
        setLoading(true);

        try {
            // Llamar a la función register del contexto de autenticación
            // El AuthContext maneja la comunicación con el backend
            const result = await register(username, email, password);

            if (result.success) {
                // Si el registro fue exitoso, el usuario ya está logueado automáticamente
                // (el AuthContext hace auto-login después del registro)
                // Redirigir a la página de productos
                navigate('/productos');
            } else {
                // Si el registro falló, mostrar mensaje de error del backend
                setError(result.message);
            }
        } catch (err) {
            // Si hay un error de conexión o del servidor, mostrar error genérico
            setError('Error al registrarse. Intenta nuevamente.');
        } finally {
            // Siempre desactivar el estado de carga, sin importar el resultado
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0">
                        <div className="card-body p-5">
                            <div className="text-center mb-4">
                                <h1 className="fw-bold text-dark mb-2">🎭 Tienda Funkos</h1>
                                <h2 className="h4 text-muted">Crear Cuenta</h2>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label fw-semibold text-dark">
                                        Nombre de Usuario
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        id="username"
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Elige un nombre de usuario"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-semibold text-dark">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control form-control-lg"
                                        id="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="tu@email.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-semibold text-dark">
                                        Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Mínimo 6 caracteres"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="confirmPassword" className="form-label fw-semibold text-dark">
                                        Confirmar Contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control form-control-lg"
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Repite tu contraseña"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 btn-lg mb-3"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            Registrando...
                                        </>
                                    ) : (
                                        'Crear Cuenta'
                                    )}
                                </button>
                            </form>

                            <div className="text-center mt-4">
                                <p className="mb-0 text-muted">
                                    ¿Ya tienes cuenta?{' '}
                                    <Link to="/login" className="text-primary fw-semibold text-decoration-none">
                                        Inicia Sesión
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
