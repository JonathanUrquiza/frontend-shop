import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        // Validaciones
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (!email.includes('@')) {
            setError('Por favor ingresa un email válido');
            return;
        }

        if (username.length < 3) {
            setError('El nombre de usuario debe tener al menos 3 caracteres');
            return;
        }

        setLoading(true);

        try {
            const result = await register(username, email, password);

            if (result.success) {
                // El usuario ya está logueado automáticamente
                navigate('/productos');
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Error al registrarse. Intenta nuevamente.');
        } finally {
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
