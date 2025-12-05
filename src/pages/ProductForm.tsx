import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

// URL del backend - usa variable de entorno o fallback
const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

interface Category {
  category_id: number;
  category_name: string;
}

interface Licence {
  licence_id: number;
  licence_name: string;
}

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addProduct, updateProduct, getProduct } = useProducts();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    category: '',
    licence: '',
    product_name: '',
    product_description: '',
    sku: '',
    price: '',
    stock: '',
    discount: '',
    dues: '0',
  });

  // Estados para las imágenes
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [backImage, setBackImage] = useState<File | null>(null);
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [additionalImagesPreviews, setAdditionalImagesPreviews] = useState<string[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);
  const [licences, setLicences] = useState<Licence[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // Cargar categorías y licencias
  useEffect(() => {
    const fetchCategoriesAndLicences = async () => {
      try {
        setLoadingData(true);
        const [categoriesRes, licencesRes] = await Promise.all([
          fetch(`${API_URL}/category/`),
          fetch(`${API_URL}/licence/`)
        ]);

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          console.log('Categorías recibidas:', categoriesData);
          // Asegurar que categoriesData sea un array
          if (Array.isArray(categoriesData)) {
            setCategories(categoriesData);
          } else if (categoriesData && Array.isArray(categoriesData.categories)) {
            setCategories(categoriesData.categories);
          } else {
            console.error('Formato de categorías inesperado:', categoriesData);
            setCategories([]);
          }
        } else {
          const errorText = await categoriesRes.text();
          console.error('Error al cargar categorías:', categoriesRes.status, errorText);
          setErrors(['Error al cargar las categorías. Por favor, recarga la página.']);
        }

        if (licencesRes.ok) {
          const licencesData = await licencesRes.json();
          console.log('Licencias recibidas:', licencesData);
          // Asegurar que licencesData sea un array
          if (Array.isArray(licencesData)) {
            setLicences(licencesData);
          } else if (licencesData && Array.isArray(licencesData.licences)) {
            setLicences(licencesData.licences);
          } else {
            console.error('Formato de licencias inesperado:', licencesData);
            setLicences([]);
          }
        } else {
          const errorText = await licencesRes.text();
          console.error('Error al cargar licencias:', licencesRes.status, errorText);
          setErrors(prev => [...prev, 'Error al cargar las licencias. Por favor, recarga la página.']);
        }
      } catch (error) {
        console.error('Error al cargar categorías y licencias:', error);
        setErrors(['Error de conexión al cargar los datos. Verifica que el servidor esté corriendo.']);
      } finally {
        setLoadingData(false);
      }
    };

    fetchCategoriesAndLicences();
  }, []);

  // Cargar datos del producto si está en modo edición
  useEffect(() => {
    if (isEditMode && id && !loadingData) {
      const fetchProductData = async () => {
        try {
          const response = await fetch(`${API_URL}/product/find/id/${id}/`);
          if (response.ok) {
            const product = await response.json();
            
            // Manejar category (puede ser objeto o string)
            let categoryValue = '';
            if (product.category) {
              if (typeof product.category === 'object') {
                categoryValue = product.category.category_id?.toString() || product.category.category_name || '';
              } else {
                categoryValue = product.category;
              }
            }
            
            // Manejar licence (puede ser objeto o string)
            let licenceValue = '';
            if (product.licence) {
              if (typeof product.licence === 'object') {
                licenceValue = product.licence.licence_id?.toString() || product.licence.licence_name || '';
              } else {
                licenceValue = product.licence;
              }
            }
            
            setFormData({
              category: categoryValue,
              licence: licenceValue,
              product_name: product.product_name,
              product_description: product.product_description || product.description || '',
              sku: product.sku,
              price: product.price.toString(),
              stock: product.stock.toString(),
              discount: product.discount?.toString() || '0',
              dues: product.dues?.toString() || '0',
            });
            
            // Cargar previews de imágenes existentes si están disponibles
            if (product.image_front) {
              setFrontImagePreview(`/multimedia${product.image_front}`);
            }
            if (product.image_back) {
              setBackImagePreview(`/multimedia${product.image_back}`);
            }
            // Cargar imágenes adicionales si existen
            if (product.additional_images && Array.isArray(product.additional_images)) {
              const additionalPreviews = product.additional_images.map((img: string) => `/multimedia${img}`);
              setAdditionalImagesPreviews(additionalPreviews);
            }
          } else {
            console.error('Error al cargar el producto:', response.status);
            setErrors(['Error al cargar los datos del producto']);
          }
        } catch (error) {
          console.error('Error al cargar el producto:', error);
          setErrors(['Error de conexión al cargar el producto']);
        }
      };
      
      fetchProductData();
    }
  }, [id, isEditMode, loadingData]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    setSuccessMessage(''); // Limpiar mensaje de éxito

    if (!formData.category) {
      newErrors.push('La categoría es requerida');
    }

    if (!formData.licence) {
      newErrors.push('La licencia es requerida');
    }

    if (!formData.product_name.trim()) {
      newErrors.push('El nombre del producto es requerido');
    } else if (formData.product_name.trim().length < 3) {
      newErrors.push('El nombre del producto debe tener al menos 3 caracteres');
    }

    if (!formData.product_description.trim()) {
      newErrors.push('La descripción del producto es requerida');
    } else if (formData.product_description.trim().length < 10) {
      newErrors.push('La descripción debe tener al menos 10 caracteres');
    }

    if (!formData.sku.trim()) {
      newErrors.push('El SKU es requerido');
    } else if (formData.sku.trim().length < 3) {
      newErrors.push('El SKU debe tener al menos 3 caracteres');
    }

    const priceValue = parseFloat(formData.price);
    if (!formData.price || isNaN(priceValue) || priceValue <= 0) {
      newErrors.push('El precio debe ser un número mayor a 0');
    }

    const stockValue = parseInt(formData.stock);
    if (!formData.stock || isNaN(stockValue) || stockValue < 0) {
      newErrors.push('El stock debe ser un número entero mayor o igual a 0');
    }

    const discountValue = formData.discount ? parseInt(formData.discount) : 0;
    if (formData.discount && (isNaN(discountValue) || discountValue < 0 || discountValue > 100)) {
      newErrors.push('El descuento debe ser un número entre 0 y 100');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back' | 'additional') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'front') {
      setFrontImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (type === 'back') {
      setBackImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (type === 'additional') {
      const files = Array.from(e.target.files || []);
      setAdditionalImages(prev => [...prev, ...files]);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAdditionalImagesPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeAdditionalImage = (index: number) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    setAdditionalImagesPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    // Validar que haya al menos la imagen frontal
    if (!frontImage && !isEditMode) {
      setErrors(['La imagen frontal es obligatoria']);
      return;
    }

    setLoading(true);

    try {
      // Encontrar los IDs de categoría y licencia
      const selectedCategory = categories.find(cat => 
        cat.category_id.toString() === formData.category || cat.category_name === formData.category
      );
      const selectedLicence = licences.find(lic => 
        lic.licence_id.toString() === formData.licence || lic.licence_name === formData.licence
      );

      if (!selectedCategory) {
        setErrors(['Categoría seleccionada no válida']);
        setLoading(false);
        return;
      }

      if (!selectedLicence) {
        setErrors(['Licencia seleccionada no válida']);
        setLoading(false);
        return;
      }

      // Crear FormData para enviar archivos
      const formDataToSend = new FormData();
      formDataToSend.append('product_name', formData.product_name.trim());
      formDataToSend.append('product_description', formData.product_description.trim());
      formDataToSend.append('price', parseFloat(formData.price).toString());
      formDataToSend.append('stock', parseInt(formData.stock).toString());
      formDataToSend.append('sku', formData.sku.trim().toUpperCase());
      formDataToSend.append('discount', formData.discount ? parseInt(formData.discount).toString() : '0');
      formDataToSend.append('dues', formData.dues && formData.dues !== '0' ? formData.dues : '0');
      formDataToSend.append('licence_id', selectedLicence.licence_id.toString());
      formDataToSend.append('category_id', selectedCategory.category_id.toString());
      formDataToSend.append('created_by', '1'); // Por defecto, debería venir del usuario autenticado

      // Agregar imágenes
      if (frontImage) {
        formDataToSend.append('image_front', frontImage);
      }
      if (backImage) {
        formDataToSend.append('image_back', backImage);
      }
      
      // Agregar imágenes adicionales con índices
      additionalImages.forEach((img, idx) => {
        formDataToSend.append(`image_additional_${idx}`, img);
      });

      // Enviar al backend
      const url = isEditMode 
        ? `${API_URL}/product/update/${id}/`
        : `${API_URL}/product/create/`;
      
      console.log('Enviando producto:', {
        url,
        isEditMode,
        formData,
        hasFrontImage: !!frontImage,
        hasBackImage: !!backImage,
        additionalImagesCount: additionalImages.length
      });
      
      const response = await fetch(url, {
        method: 'POST',
        body: formDataToSend,
      });

      console.log('Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });

      let responseData;
      try {
        responseData = await response.json();
        console.log('Datos de respuesta:', responseData);
      } catch (e) {
        // Si la respuesta no es JSON, intentar leer como texto
        const text = await response.text();
        console.error('Error al parsear respuesta JSON:', e);
        console.error('Respuesta como texto:', text);
        setErrors([`Error del servidor: ${text || 'Respuesta inválida'}`]);
        setLoading(false);
        return;
      }

      if (response.ok) {
        setSuccessMessage(isEditMode ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
        if (!isEditMode) {
          resetForm();
        }
        setTimeout(() => {
          navigate('/productos');
        }, 1500);
      } else {
        // Mejorar el manejo de errores
        const errorMessage = responseData?.message || responseData?.error || 'Error al guardar el producto';
        console.error('Error del servidor:', {
          status: response.status,
          responseData,
          url
        });
        setErrors([errorMessage]);
      }
    } catch (error: any) {
      console.error('Error al guardar producto:', error);
      const errorMessage = error?.message || 'Error al guardar el producto. Verifica la conexión con el servidor.';
      setErrors([errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Validar campos numéricos
    if (name === 'stock' || name === 'discount') {
      // Solo permitir números enteros
      const numericValue = value.replace(/[^\d]/g, '');
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Formatear precio mientras se escribe
  const formatPrice = (value: string) => {
    // Remover caracteres no numéricos excepto punto decimal
    const numericValue = value.replace(/[^\d.]/g, '');
    // Asegurar que solo haya un punto decimal
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('');
    }
    return numericValue;
  };

  // Limpiar formulario después de crear producto exitosamente
  const resetForm = () => {
    setFormData({
      category: '',
      licence: '',
      product_name: '',
      product_description: '',
      sku: '',
      price: '',
      stock: '',
      discount: '',
      dues: '0',
    });
    setFrontImage(null);
    setBackImage(null);
    setAdditionalImages([]);
    setFrontImagePreview(null);
    setBackImagePreview(null);
    setAdditionalImagesPreviews([]);
    setErrors([]);
    setSuccessMessage('');
  };

  if (loadingData) {
    return (
      <div className="container mt-5 mb-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3" style={{ fontSize: '1.8rem' }}>Cargando formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <main id="create" className="container" style={{ marginTop: '80px', marginBottom: '80px' }}>
      <h2 className="create__title" style={{ fontSize: '2.4rem', fontWeight: '700', marginBottom: '3.6rem' }}>
        {isEditMode ? 'EDITAR ITEM' : 'CREAR NUEVO ITEM'}
      </h2>
      
      <form className="create__form" onSubmit={handleSubmit} style={{ maxWidth: '990px', display: 'flex', flexDirection: 'column', gap: '4.8rem' }}>
        {errors.length > 0 && (
          <div className="alert alert-danger" role="alert">
            <strong>Errores encontrados:</strong>
            <ul className="mb-0 mt-2">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {successMessage && (
          <div className="alert alert-success" role="alert">
            <strong>¡Éxito!</strong> {successMessage}
          </div>
        )}

        <div className="form__flex" style={{ display: 'flex', gap: '3.6rem' }}>
          <div className="form__box--flex" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
            <label className="form__label" htmlFor="category" style={{ fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px' }}>
              Categoría:
            </label>
            <select
              className="form__select"
              name="category"
              id="category"
              value={formData.category}
              onChange={handleChange}
              required
              disabled={loading || categories.length === 0}
              style={{ borderRadius: '6px', border: '2px solid #1F1F1F', fontSize: '1.8rem', padding: '0.8rem' }}
            >
              <option value="" disabled hidden>
                {categories.length === 0 ? 'Cargando categorías...' : 'Seleccionar'}
              </option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
            {categories.length === 0 && !loadingData && (
              <div style={{ fontSize: '1.2rem', color: '#dc3545', marginTop: '0.5rem' }}>
                <p>No hay categorías disponibles.</p>
                <p>
                  <a href="/admin/categorias/new" style={{ color: '#007bff', textDecoration: 'underline' }}>
                    Crear una nueva categoría
                  </a>
                </p>
              </div>
            )}
          </div>

          <div className="form__box--flex" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
            <label className="form__label" htmlFor="licence" style={{ fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px' }}>
              Licencia:
            </label>
            <select
              className="form__select"
              name="licence"
              id="licence"
              value={formData.licence}
              onChange={handleChange}
              required
              disabled={loading || licences.length === 0}
              style={{ borderRadius: '6px', border: '2px solid #1F1F1F', fontSize: '1.8rem', padding: '0.8rem' }}
            >
              <option value="" disabled hidden>
                {licences.length === 0 ? 'Cargando licencias...' : 'Seleccionar'}
              </option>
              {licences.map((licence) => (
                <option key={licence.licence_id} value={licence.licence_id}>
                  {licence.licence_name}
                </option>
              ))}
            </select>
            {licences.length === 0 && !loadingData && (
              <div style={{ fontSize: '1.2rem', color: '#dc3545', marginTop: '0.5rem' }}>
                <p>No hay licencias disponibles.</p>
                <p>
                  <a href="/admin/licencias/new" style={{ color: '#007bff', textDecoration: 'underline' }}>
                    Crear una nueva licencia
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="form__box--flex" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <label className="form__label" htmlFor="product_name" style={{ fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px' }}>
            Nombre del producto:
          </label>
          <input
            className="form__input"
            type="text"
            name="product_name"
            id="product_name"
            value={formData.product_name}
            onChange={handleChange}
            placeholder="Kakashi Hatake Shippuden Saga"
            required
            disabled={loading}
            style={{ padding: '1rem 0.5rem', border: 'none', borderBottom: '2px solid #FF3333', fontSize: '1.8rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <label className="form__label" htmlFor="product_description" style={{ fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px' }}>
            Descripción:
          </label>
          <textarea
            name="product_description"
            id="product_description"
            cols={30}
            rows={10}
            value={formData.product_description}
            onChange={handleChange}
            placeholder="Descripción del producto"
            required
            disabled={loading}
            style={{ width: '100%', padding: '0.8rem', border: '2px solid #1F1F1F', borderRadius: '6px', fontSize: '1.8rem' }}
          />
        </div>

        <div className="form__flex" style={{ display: 'flex', gap: '3.6rem' }}>
          <div className="form__box--flex" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
            <label className="form__label" htmlFor="sku" style={{ fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px' }}>
              SKU:
            </label>
            <input
              className="form__input"
              type="text"
              name="sku"
              id="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="SSK111AB001"
              required
              disabled={loading}
              style={{ padding: '1rem 0.5rem', border: 'none', borderBottom: '2px solid #FF3333', fontSize: '1.8rem' }}
            />
          </div>

          <div className="form__box--flex" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
            <label className="form__label" htmlFor="price" style={{ fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px' }}>
              Precio:
            </label>
            <div className="form__input--wrapper" style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: '1.8rem', padding: '1rem 0.5rem', borderBottom: '2px solid #FF3333' }}>$</span>
              <input
                className="form__input"
                type="text"
                name="price"
                id="price"
                value={formData.price}
                onChange={(e) => {
                  const formatted = formatPrice(e.target.value);
                  setFormData({ ...formData, price: formatted });
                }}
                placeholder="0.00"
                required
                disabled={loading}
                style={{ padding: '1rem 0.5rem', border: 'none', borderBottom: '2px solid #FF3333', fontSize: '1.8rem', flex: 1 }}
              />
            </div>
          </div>

          <div className="form__box--flex" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
            <label className="form__label" htmlFor="stock" style={{ fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px' }}>
              Stock:
            </label>
            <div className="form__input--wrapper" style={{ display: 'flex', alignItems: 'center' }}>
              <input
                className="form__input"
                type="text"
                name="stock"
                id="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                required
                disabled={loading}
                inputMode="numeric"
                pattern="[0-9]*"
                style={{ padding: '1rem 0.5rem', border: 'none', borderBottom: '2px solid #FF3333', fontSize: '1.8rem', flex: 1 }}
              />
              <span style={{ fontSize: '1.8rem', padding: '1rem 0.5rem', borderBottom: '2px solid #FF3333' }}>unidades</span>
            </div>
          </div>
        </div>

        <div className="form__flex" style={{ display: 'flex', gap: '3.6rem' }}>
          <div className="form__box--flex" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
            <label className="form__label" htmlFor="discount" style={{ fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px' }}>
              Descuento:
            </label>
            <div className="form__input--wrapper" style={{ display: 'flex', alignItems: 'center' }}>
              <input
                className="form__input"
                type="text"
                name="discount"
                id="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0"
                required
                disabled={loading}
                inputMode="numeric"
                pattern="[0-9]*"
                style={{ padding: '1rem 0.5rem', border: 'none', borderBottom: '2px solid #FF3333', fontSize: '1.8rem', flex: 1 }}
              />
              <span style={{ fontSize: '1.8rem', padding: '1rem 0.5rem', borderBottom: '2px solid #FF3333' }}>%</span>
            </div>
          </div>

          <div className="form__box--flex" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', flex: 1 }}>
            <label className="form__label" htmlFor="dues" style={{ fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px' }}>
              Cuotas:
            </label>
            <select
              className="form__select"
              name="dues"
              id="dues"
              value={formData.dues}
              onChange={handleChange}
              disabled={loading}
              style={{ borderRadius: '6px', border: '2px solid #1F1F1F', fontSize: '1.8rem', padding: '0.8rem' }}
            >
              <option value="0">Sin cuotas</option>
              <option value="3">3 cuotas s/ interés</option>
              <option value="6">6 cuotas s/ interés</option>
              <option value="9">9 cuotas s/ interés</option>
              <option value="12">12 cuotas s/ interés</option>
              <option value="18">18 cuotas s/ interés</option>
              <option value="24">24 cuotas s/ interés</option>
            </select>
          </div>
        </div>

        <div className="form__box--flex" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <label className="form__label" htmlFor="image_front" style={{ fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px' }}>
            Imagen Frontal * (primera imagen - se usa en lista de productos):
          </label>
          <input
            className="form-control"
            type="file"
            id="image_front"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 'front')}
            disabled={loading}
            required={!isEditMode}
            style={{ padding: '0.8rem', border: '2px solid #1F1F1F', borderRadius: '6px', fontSize: '1.6rem' }}
          />
          {frontImagePreview && (
            <div className="mt-2">
              <img
                src={frontImagePreview}
                alt="Preview frontal"
                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                className="img-thumbnail"
              />
            </div>
          )}
          <small style={{ fontSize: '1.4rem', color: '#666' }}>
            Esta imagen se guardará automáticamente como: {formData.product_name ? `${formData.product_name.toLowerCase().replace(/\s+/g, '-')}-1.webp` : 'producto-1.webp'}
          </small>
        </div>

        <div className="form__box--flex" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <label className="form__label" htmlFor="image_back" style={{ fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px' }}>
            Imagen Reverso (segunda imagen - opcional):
          </label>
          <input
            className="form-control"
            type="file"
            id="image_back"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 'back')}
            disabled={loading}
            style={{ padding: '0.8rem', border: '2px solid #1F1F1F', borderRadius: '6px', fontSize: '1.6rem' }}
          />
          {backImagePreview && (
            <div className="mt-2">
              <img
                src={backImagePreview}
                alt="Preview reverso"
                style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
                className="img-thumbnail"
              />
            </div>
          )}
          <small style={{ fontSize: '1.4rem', color: '#666' }}>
            Esta imagen se guardará automáticamente como: {formData.product_name ? `${formData.product_name.toLowerCase().replace(/\s+/g, '-')}-box.webp` : 'producto-box.webp'}
          </small>
        </div>

        <div className="form__box--flex" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <label className="form__label" htmlFor="image_additional" style={{ fontSize: '1.8rem', fontWeight: '600', letterSpacing: '1px' }}>
            Imágenes Adicionales (para vista de detalle - opcional):
          </label>
          <input
            className="form-control"
            type="file"
            id="image_additional"
            accept="image/*"
            multiple
            onChange={(e) => handleImageChange(e, 'additional')}
            disabled={loading}
            style={{ padding: '0.8rem', border: '2px solid #1F1F1F', borderRadius: '6px', fontSize: '1.6rem' }}
          />
          {additionalImagesPreviews.length > 0 && (
            <div className="mt-2 d-flex flex-wrap gap-2">
              {additionalImagesPreviews.map((preview, idx) => (
                <div key={idx} style={{ position: 'relative' }}>
                  <img
                    src={preview}
                    alt={`Preview adicional ${idx + 1}`}
                    style={{ maxWidth: '150px', maxHeight: '150px', objectFit: 'cover' }}
                    className="img-thumbnail"
                  />
                  <button
                    type="button"
                    onClick={() => removeAdditionalImage(idx)}
                    className="btn btn-sm btn-danger"
                    style={{ position: 'absolute', top: '5px', right: '5px' }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <small style={{ fontSize: '1.4rem', color: '#666' }}>
            Puedes seleccionar múltiples imágenes. Se guardarán automáticamente en la carpeta del producto.
          </small>
        </div>

        <div className="form__flex" style={{ display: 'flex', gap: '3.6rem', justifyContent: 'center' }}>
          <button
            className="form__btn btn btn--primary btn--large"
            type="submit"
            disabled={loading}
            style={{
              padding: '1.2rem 2.7rem',
              maxWidth: '200px',
              backgroundColor: '#FF3333',
              color: '#FFFFFF',
              fontWeight: '500',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.4rem',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#111111';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#FF3333';
            }}
          >
            {loading ? 'Guardando...' : (isEditMode ? 'Actualizar Producto' : 'Agregar Producto')}
          </button>
          <button
            className="form__btn btn btn--secondary"
            type="button"
            onClick={() => navigate('/productos')}
            disabled={loading}
            style={{
              padding: '1.2rem 2.7rem',
              maxWidth: '200px',
              backgroundColor: '#666',
              color: '#FFFFFF',
              fontWeight: '500',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1.4rem',
              transition: 'background 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#444';
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#666';
            }}
          >
            Cancelar
          </button>
        </div>
      </form>
    </main>
  );
};

export default ProductForm;
