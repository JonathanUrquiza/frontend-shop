import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

interface Role {
  role_id: number;
  role_name: string;
}

const UserForm: React.FC = () => {
  const { isAdmin } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    role_id: '',
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      setError('No tienes permisos para acceder a esta página');
      return;
    }

    fetchRoles();

    if (isEditMode) {
      fetchUser();
    }
  }, [id, isAdmin, isEditMode]);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/useraccount/roles/`);
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles || []);
      }
    } catch (err) {
      console.error('Error al cargar roles:', err);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch(`${API_URL}/useraccount/list/`);
      if (response.ok) {
        const data = await response.json();
        const user = data.users.find((u: any) => u.user_id === parseInt(id!));
        if (user) {
          setFormData({
            name: user.name || '',
            lastname: user.lastname || '',
            email: user.email || '',
            password: '', // No mostrar contraseña
            role_id: user.role_id?.toString() || '',
          });
        }
      }
    } catch (err) {
      setError('Error al cargar el usuario');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = isEditMode
        ? `${API_URL}/useraccount/update/${id}/`
        : `${API_URL}/useraccount/create/`;

      const method = isEditMode ? 'PUT' : 'POST';

      const body = {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        role_id: formData.role_id ? parseInt(formData.role_id) : null,
      };

      // Solo incluir password si se está creando o si se está editando y se proporcionó
      if (!isEditMode || formData.password) {
        (body as any).password = formData.password;
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        alert(isEditMode ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
        navigate('/admin/usuarios');
      } else {
        setError(data.message || 'Error al guardar el usuario');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          No tienes permisos para acceder a esta página
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="h2 mb-4">
            {isEditMode ? 'Editar Usuario' : 'Crear Usuario'}
          </h1>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Nombre *
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                maxLength={16}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastname" className="form-label">
                Apellido *
              </label>
              <input
                type="text"
                className="form-control"
                id="lastname"
                value={formData.lastname}
                onChange={(e) =>
                  setFormData({ ...formData, lastname: e.target.value })
                }
                required
                maxLength={80}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                maxLength={255}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña {isEditMode ? '(dejar vacío para mantener)' : '*'}
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required={!isEditMode}
                maxLength={32}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="role_id" className="form-label">
                Rol
              </label>
              <select
                className="form-select"
                id="role_id"
                value={formData.role_id}
                onChange={(e) =>
                  setFormData({ ...formData, role_id: e.target.value })
                }
              >
                <option value="">Sin rol</option>
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.role_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
              </button>
              <Link to="/admin/usuarios" className="btn btn-secondary">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;

