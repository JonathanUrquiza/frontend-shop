/**
 * Componente UserList - Lista de usuarios para administradores.
 * 
 * Este componente permite a los administradores ver todos los usuarios
 * registrados en el sistema en formato de tabla, con opciones para
 * editar y eliminar usuarios.
 * 
 * Características:
 * - Tabla con todos los usuarios del sistema
 * - Muestra información: ID, nombre, apellido, email, rol, fecha de registro
 * - Botones para editar y eliminar usuarios
 * - Botón para crear nuevo usuario
 * - Validación de permisos (solo admin)
 * - Manejo de estados de carga y errores
 */

// Importar React y hooks necesarios
import React, { useEffect, useState } from 'react';
// Importar Link de react-router-dom para navegación
import { Link } from 'react-router-dom';
// Importar hook useAuth para verificar permisos
import { useAuth } from '../context/AuthContext';

// URL del backend - usa variable de entorno o fallback a localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

/**
 * Interfaz que define la estructura de un usuario.
 * 
 * Esta interfaz representa los datos de un usuario que se muestran
 * en la tabla de usuarios.
 */
interface User {
  user_id: number;  // ID único del usuario
  name: string;  // Nombre del usuario
  lastname: string;  // Apellido del usuario
  email: string;  // Email del usuario
  role_id: number | null;  // ID del rol asignado (null si no tiene rol)
  role_name: string | null;  // Nombre del rol (null si no tiene rol)
  create_time: string | null;  // Fecha de registro (ISO string o null)
}

/**
 * Componente funcional UserList.
 * 
 * Renderiza una tabla con todos los usuarios del sistema y permite
 * gestionarlos (editar, eliminar, crear nuevo).
 * 
 * @returns {JSX.Element} Tabla de usuarios o mensaje de error/permisos
 */
const UserList: React.FC = () => {
  // Obtener estado de permisos del contexto de autenticación
  const { isAdmin } = useAuth();
  
  // Estado para almacenar la lista de usuarios
  const [users, setUsers] = useState<User[]>([]);
  
  // Estado para indicar si se están cargando los usuarios
  const [loading, setLoading] = useState(true);
  
  // Estado para almacenar mensajes de error
  const [error, setError] = useState('');

  // Efecto que se ejecuta al montar el componente y cuando cambia isAdmin
  useEffect(() => {
    // Validar permisos antes de cargar usuarios
    if (!isAdmin) {
      // Si no es admin, mostrar error y detener la carga
      setError('No tienes permisos para ver esta página');
      setLoading(false);
      return;  // Salir temprano si no tiene permisos
    }

    // Si tiene permisos, cargar la lista de usuarios
    fetchUsers();
  }, [isAdmin]);  // Se ejecuta cuando cambia isAdmin

  /**
   * Función para cargar usuarios desde el backend.
   * 
   * Hace una petición GET al endpoint /useraccount/list/ y actualiza el estado
   * con los usuarios recibidos.
   */
  const fetchUsers = async () => {
    try {
      // Hacer petición GET al backend para obtener todos los usuarios
      const response = await fetch(`${API_URL}/useraccount/list/`);
      
      if (response.ok) {
        // Si la respuesta es exitosa, parsear JSON
        const data = await response.json();
        
        // Actualizar estado con los usuarios recibidos
        // data.users puede ser un array o undefined, usar || [] como fallback
        setUsers(data.users || []);
      } else {
        // Si la respuesta no es exitosa, establecer mensaje de error
        setError('Error al cargar los usuarios');
      }
    } catch (err) {
      // Si hay error de conexión, establecer mensaje de error
      setError('Error de conexión con el servidor');
    } finally {
      // Siempre desactivar el estado de carga, sin importar el resultado
      setLoading(false);
    }
  };

  /**
   * Función para eliminar un usuario.
   * 
   * Muestra un diálogo de confirmación antes de eliminar y luego hace
   * una petición DELETE al backend.
   * 
   * @param {number} userId - ID del usuario a eliminar
   */
  const handleDelete = async (userId: number) => {
    // Mostrar diálogo de confirmación antes de eliminar
    // window.confirm retorna true si el usuario confirma, false si cancela
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;  // Si el usuario cancela, no hacer nada
    }

    try {
      // Hacer petición DELETE al backend para eliminar el usuario
      const response = await fetch(`${API_URL}/useraccount/delete/${userId}/`, {
        method: 'DELETE',  // Método HTTP DELETE
      });

      if (response.ok) {
        // Si se eliminó exitosamente, remover el usuario de la lista local
        // Esto actualiza la UI inmediatamente sin necesidad de recargar
        setUsers(users.filter(u => u.user_id !== userId));
        
        // Mostrar mensaje de éxito
        alert('Usuario eliminado exitosamente');
      } else {
        // Si hubo error, parsear respuesta y mostrar mensaje de error
        const data = await response.json();
        alert(data.message || 'Error al eliminar el usuario');
      }
    } catch (err) {
      // Si hay error de conexión, mostrar mensaje de error
      alert('Error de conexión con el servidor');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Gestión de Usuarios</h1>
        <Link to="/admin/usuarios/new" className="btn btn-primary">
          + Crear Usuario
        </Link>
      </div>

      {users.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No hay usuarios registrados.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.name}</td>
                  <td>{user.lastname}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge bg-secondary">
                      {user.role_name || 'Sin rol'}
                    </span>
                  </td>
                  <td>
                    {user.create_time
                      ? new Date(user.create_time).toLocaleDateString('es-ES')
                      : '-'}
                  </td>
                  <td>
                    <Link
                      to={`/admin/usuarios/edit/${user.user_id}`}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      Editar
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user.user_id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;

