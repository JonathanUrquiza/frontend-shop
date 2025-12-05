import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

interface User {
  user_id: number;
  name: string;
  lastname: string;
  email: string;
  role_id: number | null;
  role_name: string | null;
  create_time: string | null;
}

const UserList: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      setError('No tienes permisos para ver esta página');
      setLoading(false);
      return;
    }

    fetchUsers();
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/useraccount/list/`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        setError('Error al cargar los usuarios');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/useraccount/delete/${userId}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(u => u.user_id !== userId));
        alert('Usuario eliminado exitosamente');
      } else {
        const data = await response.json();
        alert(data.message || 'Error al eliminar el usuario');
      }
    } catch (err) {
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

