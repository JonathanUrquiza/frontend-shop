import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Pasar el email directamente - el AuthContext maneja tanto email como username
      const success = await login(email, password);
      if (success) {
        navigate('/productos');
      } else {
        setError('Email o contraseña incorrectos');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta nuevamente.');
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
                <h2 className="h4 text-muted">Iniciar Sesión</h2>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
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

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-semibold text-dark">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    id="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
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
                      Iniciando sesión...
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <p className="mb-0 text-muted">
                  ¿No tienes cuenta?{' '}
                  <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                    Regístrate aquí
                  </Link>
                </p>
              </div>

              <div className="mt-4 p-3 bg-light rounded">
                <p className="mb-2 text-dark fw-semibold small">Credenciales de prueba:</p>
                <p className="mb-1 small text-muted">👑 Admin: <code>admin@funkopop.com</code> / <code>admin123</code></p>
                <p className="mb-1 small text-muted">🛍️ Vendedor: <code>vendedor@funkopop.com</code> / <code>vendedor123</code></p>
                <p className="mb-1 small text-muted">🛒 Comprador: <code>comprador@funkopop.com</code> / <code>comprador123</code></p>
                <p className="mb-0 small text-muted">🔀 Mixto: <code>mixto@funkopop.com</code> / <code>mixto123</code></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
