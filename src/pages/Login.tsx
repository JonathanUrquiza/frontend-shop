/**
 * Componente Login - Página de inicio de sesión.
 * 
 * Este componente permite a los usuarios autenticarse en el sistema.
 * Maneja el formulario de login, validación y redirección después del login exitoso.
 * 
 * Características:
 * - Formulario de login con email y contraseña
 * - Validación de campos requeridos
 * - Manejo de errores de autenticación
 * - Redirección automática después del login exitoso
 * - Muestra credenciales de prueba para desarrollo
 */

// Importar React y hooks necesarios
import React, { useState, FormEvent } from 'react';
// Importar hooks de react-router-dom para navegación
import { useNavigate, Link } from 'react-router-dom';
// Importar hook useAuth del contexto de autenticación
import { useAuth } from '../context/AuthContext';

/**
 * Componente funcional Login.
 * 
 * Renderiza un formulario de login que permite a los usuarios autenticarse.
 * 
 * @returns {JSX.Element} Componente de login con formulario y credenciales de prueba
 */
const Login: React.FC = () => {
  // Estado para almacenar el email ingresado por el usuario
  const [email, setEmail] = useState('');
  
  // Estado para almacenar la contraseña ingresada por el usuario
  const [password, setPassword] = useState('');
  
  // Estado para almacenar mensajes de error (si los hay)
  const [error, setError] = useState('');
  
  // Estado para indicar si se está procesando el login (loading)
  const [loading, setLoading] = useState(false);
  
  // Hook para navegar programáticamente a otras rutas
  const navigate = useNavigate();
  
  // Obtener función login del contexto de autenticación
  const { login } = useAuth();

  /**
   * Maneja el envío del formulario de login.
   * 
   * Esta función se ejecuta cuando el usuario hace submit del formulario.
   * Valida los datos, llama al backend para autenticar y maneja la respuesta.
   * 
   * @param {FormEvent} e - Evento del formulario (para prevenir recarga de página)
   */
  const handleSubmit = async (e: FormEvent) => {
    // Prevenir el comportamiento por defecto del formulario (recarga de página)
    e.preventDefault();
    
    // Limpiar cualquier error previo
    setError('');
    
    // Activar estado de carga (muestra spinner y deshabilita botón)
    setLoading(true);

    try {
      // Llamar a la función login del contexto de autenticación
      // El AuthContext maneja la comunicación con el backend
      // Pasar el email directamente - el AuthContext maneja tanto email como username
      const success = await login(email, password);
      
      if (success) {
        // Si el login fue exitoso, redirigir a la página de productos
        navigate('/productos');
      } else {
        // Si el login falló, mostrar mensaje de error
        setError('Email o contraseña incorrectos');
      }
    } catch (err) {
      // Si hay un error de conexión o del servidor, mostrar error genérico
      setError('Error al iniciar sesión. Intenta nuevamente.');
    } finally {
      // Siempre desactivar el estado de carga, sin importar el resultado
      setLoading(false);
    }
  };

  // Retornar el JSX del componente (estructura del formulario de login)
  return (
    <div className="container mt-5 mb-5">
      {/* Fila centrada para el formulario (Bootstrap grid) */}
      <div className="row justify-content-center">
        {/* Columna responsive: 6 columnas en md, 5 en lg (Bootstrap) */}
        <div className="col-md-6 col-lg-5">
          {/* Tarjeta con sombra para el formulario (Bootstrap card) */}
          <div className="card shadow-lg border-0">
            {/* Cuerpo de la tarjeta con padding grande */}
            <div className="card-body p-5">
              {/* Encabezado del formulario centrado */}
              <div className="text-center mb-4">
                {/* Título principal de la tienda */}
                <h1 className="fw-bold text-dark mb-2">🎭 Tienda Funkos</h1>
                {/* Subtítulo del formulario */}
                <h2 className="h4 text-muted">Iniciar Sesión</h2>
              </div>

              {/* Mostrar mensaje de error si existe (renderizado condicional) */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {/* Formulario de login que llama a handleSubmit al hacer submit */}
              <form onSubmit={handleSubmit}>
                {/* Campo de email */}
                <div className="mb-3">
                  {/* Label asociado al input de email */}
                  <label htmlFor="email" className="form-label fw-semibold text-dark">
                    Email
                  </label>
                  {/* Input de tipo email con validación HTML5 */}
                  <input
                    type="email"  // Tipo email para validación HTML5 automática
                    className="form-control form-control-lg"  // Clases de Bootstrap para input grande
                    id="email"  // ID para asociar con el label (accesibilidad)
                    value={email}  // Valor controlado por el estado React
                    onChange={e => setEmail(e.target.value)}  // Actualizar estado al escribir
                    placeholder="tu@email.com"  // Texto de ayuda visible cuando está vacío
                    required  // Campo obligatorio (validación HTML5)
                    disabled={loading}  // Deshabilitar durante el proceso de login
                  />
                </div>

                {/* Campo de contraseña */}
                <div className="mb-4">
                  {/* Label asociado al input de contraseña */}
                  <label htmlFor="password" className="form-label fw-semibold text-dark">
                    Contraseña
                  </label>
                  {/* Input de tipo password (oculta el texto) */}
                  <input
                    type="password"  // Tipo password oculta el texto ingresado
                    className="form-control form-control-lg"  // Clases de Bootstrap para input grande
                    id="password"  // ID para asociar con el label (accesibilidad)
                    value={password}  // Valor controlado por el estado React
                    onChange={e => setPassword(e.target.value)}  // Actualizar estado al escribir
                    placeholder="••••••••"  // Texto de ayuda con puntos para indicar contraseña
                    required  // Campo obligatorio (validación HTML5)
                    disabled={loading}  // Deshabilitar durante el proceso de login
                  />
                </div>

                {/* Botón de submit del formulario */}
                <button
                  type="submit"  // Tipo submit para enviar el formulario
                  className="btn btn-primary w-100 btn-lg mb-3"  // Clases de Bootstrap: botón primario, ancho completo, grande
                  disabled={loading}  // Deshabilitar durante el proceso de login
                >
                  {/* Renderizado condicional: mostrar spinner si está cargando, sino mostrar texto */}
                  {loading ? (
                    <>
                      {/* Spinner de carga de Bootstrap (animación circular) */}
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Iniciando sesión...  {/* Texto mientras se procesa el login */}
                    </>
                  ) : (
                    'Iniciar Sesión'  // Texto normal del botón cuando no está cargando
                  )}
                </button>
              </form>

              {/* Enlace para ir a la página de registro */}
              <div className="text-center mt-4">
                <p className="mb-0 text-muted">
                  ¿No tienes cuenta?{' '}
                  {/* Link de React Router a la página de registro */}
                  <Link to="/register" className="text-primary fw-semibold text-decoration-none">
                    Regístrate aquí
                  </Link>
                </p>
              </div>

              {/* 
                Sección de credenciales de prueba para desarrollo.
                Estas credenciales se muestran solo en desarrollo para facilitar las pruebas.
                En producción, esta sección debería estar comentada o eliminada.
              
              <div className="mt-4 p-3 bg-light rounded">
                <p className="mb-2 text-dark fw-semibold small">Credenciales de prueba:</p>
                <p className="mb-1 small text-muted">👑 Admin: <code>admin@funkopop.com</code> / <code>admin123</code></p>
                <p className="mb-1 small text-muted">🛍️ Vendedor: <code>vendedor@funkopop.com</code> / <code>vendedor123</code></p>
                <p className="mb-1 small text-muted">🛒 Comprador: <code>comprador@funkopop.com</code> / <code>comprador123</code></p>
                <p className="mb-0 small text-muted">🔀 Mixto: <code>mixto@funkopop.com</code> / <code>mixto123</code></p>
              </div>
              */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
