import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const LicenceForm: React.FC = () => {
  const { isVendedor } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    licence_name: '',
    licence_description: '',
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
      formDataToSend.append('licence_name', formData.licence_name);
      formDataToSend.append('licence_description', formData.licence_description);
      
      if (imageFile) {
        formDataToSend.append('licence_image', imageFile);
      }

      const response = await fetch(`${API_URL}/licence/create/`, {
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
        setError(data.message || 'Error al crear la licencia');
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
          <h1 className="h2 mb-4">Crear Nueva Licencia</h1>

          {success && (
            <div className="alert alert-success" role="alert">
              Licencia creada exitosamente. Redirigiendo...
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="licence_name" className="form-label">
                Nombre de la Licencia *
              </label>
              <input
                type="text"
                className="form-control"
                id="licence_name"
                value={formData.licence_name}
                onChange={(e) =>
                  setFormData({ ...formData, licence_name: e.target.value })
                }
                required
                maxLength={45}
                placeholder="Ej: Pokemon, Star Wars, Harry Potter"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="licence_description" className="form-label">
                Descripción *
              </label>
              <textarea
                className="form-control"
                id="licence_description"
                rows={4}
                value={formData.licence_description}
                onChange={(e) =>
                  setFormData({ ...formData, licence_description: e.target.value })
                }
                required
                maxLength={255}
                placeholder="Descripción de la licencia..."
              />
            </div>

            <div className="mb-3">
              <label htmlFor="licence_image" className="form-label">
                Imagen de la Licencia
              </label>
              <input
                type="file"
                className="form-control"
                id="licence_image"
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
                {loading ? 'Creando...' : 'Crear Licencia'}
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

export default LicenceForm;

