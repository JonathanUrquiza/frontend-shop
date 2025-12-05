import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const CategoryForm: React.FC = () => {
  const { isVendedor } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category_name: '',
    category_description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isVendedor) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          No tienes permisos para acceder a esta página
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category_name', formData.category_name);
      formDataToSend.append('category_description', formData.category_description);
      
      if (imageFile) {
        formDataToSend.append('image_category', imageFile);
      }

      const response = await fetch(`${API_URL}/category/create/`, {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/productos');
        }, 2000);
      } else {
        setError(data.message || 'Error al crear la categoría');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="h2 mb-4">Crear Nueva Categoría</h1>

          {success && (
            <div className="alert alert-success" role="alert">
              Categoría creada exitosamente. Redirigiendo...
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="category_name" className="form-label">
                Nombre de la Categoría *
              </label>
              <input
                type="text"
                className="form-control"
                id="category_name"
                value={formData.category_name}
                onChange={(e) =>
                  setFormData({ ...formData, category_name: e.target.value })
                }
                required
                maxLength={100}
                placeholder="Ej: Funkos, Remeras, Llaveros"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="category_description" className="form-label">
                Descripción
              </label>
              <textarea
                className="form-control"
                id="category_description"
                rows={4}
                value={formData.category_description}
                onChange={(e) =>
                  setFormData({ ...formData, category_description: e.target.value })
                }
                maxLength={255}
                placeholder="Descripción de la categoría..."
              />
            </div>

            <div className="mb-3">
              <label htmlFor="image_category" className="form-label">
                Imagen de la Categoría
              </label>
              <input
                type="file"
                className="form-control"
                id="image_category"
                accept="image/*"
                onChange={handleImageChange}
              />
              {preview && (
                <div className="mt-3">
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                    className="img-thumbnail"
                  />
                </div>
              )}
            </div>

            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Categoría'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/productos')}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;

