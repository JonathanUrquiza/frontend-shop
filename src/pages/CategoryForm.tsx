/**
 * Componente CategoryForm - Formulario para crear nuevas categorías.
 * 
 * Este componente permite a usuarios con rol vendedor, mixto o admin crear
 * nuevas categorías de productos en el sistema.
 * 
 * Características:
 * - Formulario con nombre y descripción de categoría
 * - Subida de imagen con preview
 * - Validación de permisos (solo vendedor/mixto/admin)
 * - Redirección automática después de crear exitosamente
 * - Manejo de errores y estados de carga
 */

// Importar React y hooks necesarios
import React, { useState, FormEvent } from 'react';
// Importar hook useNavigate para navegación programática
import { useNavigate } from 'react-router-dom';
// Importar hook useAuth para verificar permisos
import { useAuth } from '../context/AuthContext';

// URL del backend - usa variable de entorno o fallback a localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

/**
 * Componente funcional CategoryForm.
 * 
 * Renderiza un formulario para crear nuevas categorías con validación
 * de permisos y manejo de imágenes.
 * 
 * @returns {JSX.Element} Formulario de creación de categoría o mensaje de error de permisos
 */
const CategoryForm: React.FC = () => {
  // Obtener estado de permisos del contexto de autenticación
  const { isVendedor } = useAuth();
  
  // Hook para navegar programáticamente a otras rutas
  const navigate = useNavigate();
  
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    category_name: '',  // Nombre de la categoría (obligatorio)
    category_description: '',  // Descripción de la categoría (opcional)
  });
  
  // Estado para almacenar el archivo de imagen seleccionado
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // Estado para almacenar la URL de preview de la imagen (base64)
  const [preview, setPreview] = useState<string | null>(null);
  
  // Estado para indicar si se está procesando el envío del formulario
  const [loading, setLoading] = useState(false);
  
  // Estado para almacenar mensajes de error
  const [error, setError] = useState('');
  
  // Estado para indicar si la categoría se creó exitosamente
  const [success, setSuccess] = useState(false);

  // Validar permisos antes de renderizar el formulario
  // Solo usuarios con rol vendedor, mixto o admin pueden crear categorías
  if (!isVendedor) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          No tienes permisos para acceder a esta página
        </div>
      </div>
    );
  }

  /**
   * Maneja el cambio de archivo de imagen.
   * 
   * Cuando el usuario selecciona una imagen, esta función:
   * 1. Guarda el archivo en el estado
   * 2. Crea una preview usando FileReader para mostrarla antes de subir
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento del input file
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Obtener el primer archivo seleccionado (si hay)
    const file = e.target.files?.[0];
    
    if (file) {
      // Guardar el archivo en el estado
      setImageFile(file);
      
      // Crear preview de la imagen usando FileReader
      // FileReader permite leer archivos del sistema de archivos del usuario
      const reader = new FileReader();
      
      // Cuando termine de leer el archivo, guardar el resultado como preview
      reader.onloadend = () => {
        // reader.result contiene la imagen como base64 string
        setPreview(reader.result as string);
      };
      
      // Leer el archivo como Data URL (base64)
      // Esto permite mostrar la imagen sin necesidad de subirla primero
      reader.readAsDataURL(file);
    }
  };

  /**
   * Maneja el envío del formulario.
   * 
   * Esta función se ejecuta cuando el usuario hace submit del formulario.
   * Crea un FormData con los datos del formulario y la imagen, y envía
   * una petición POST al backend para crear la categoría.
   * 
   * @param {FormEvent} e - Evento del formulario (para prevenir recarga)
   */
  const handleSubmit = async (e: FormEvent) => {
    // Prevenir el comportamiento por defecto del formulario (recarga de página)
    e.preventDefault();
    
    // Limpiar estados previos
    setError('');  // Limpiar errores anteriores
    setSuccess(false);  // Limpiar estado de éxito anterior
    setLoading(true);  // Activar estado de carga

    try {
      // Crear FormData para enviar datos del formulario y archivo
      // FormData es necesario cuando se envían archivos
      const formDataToSend = new FormData();
      
      // Agregar datos del formulario al FormData
      formDataToSend.append('category_name', formData.category_name);
      formDataToSend.append('category_description', formData.category_description);
      
      // Agregar imagen solo si se seleccionó una
      if (imageFile) {
        formDataToSend.append('image_category', imageFile);
      }

      // Enviar petición POST al backend para crear la categoría
      const response = await fetch(`${API_URL}/category/create/`, {
        method: 'POST',  // Método HTTP POST
        body: formDataToSend,  // FormData con datos y archivo
        // No especificar Content-Type header, el navegador lo hace automáticamente
        // con el boundary correcto para multipart/form-data
      });

      // Parsear respuesta JSON del backend
      const data = await response.json();

      if (response.ok) {
        // Si la respuesta es exitosa (status 200-299)
        setSuccess(true);  // Activar estado de éxito
        
        // Redirigir a la página de productos después de 2 segundos
        // Esto da tiempo al usuario de ver el mensaje de éxito
        setTimeout(() => {
          navigate('/productos');
        }, 2000);
      } else {
        // Si hay error, mostrar mensaje de error del backend o mensaje genérico
        setError(data.message || 'Error al crear la categoría');
      }
    } catch (err) {
      // Si hay error de conexión o del servidor, mostrar error genérico
      setError('Error de conexión con el servidor');
    } finally {
      // Siempre desactivar el estado de carga, sin importar el resultado
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

