# 🔧 Configuración del Backend

Este documento explica cómo el frontend está conectado al backend de Django deployado en Render.

## 📡 URL del Backend

**URL Base:** `https://backend-shop-3btv.onrender.com`

La URL se configura mediante una variable de entorno que se encuentra en el archivo `.env`:

```env
REACT_APP_API_URL=https://backend-shop-3btv.onrender.com
```

## ⚙️ Configuración Inicial

### 1. Variables de Entorno

El archivo `.env` ya está creado en la raíz del proyecto. Si necesitas recrearlo o cambiarlo:

1. Copia el archivo `.env.example`:
```bash
cp .env.example .env
```

2. Edita el archivo `.env` si necesitas cambiar la URL del backend

### 2. Reiniciar el Servidor

**IMPORTANTE:** Después de modificar el archivo `.env`, debes reiniciar el servidor de desarrollo:

```bash
# Detener el servidor (Ctrl+C) y luego:
npm start
```

## 🌐 Endpoints del Backend

### 📦 Productos (`/product/`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/product/list/` | Listar todos los productos |
| `GET` | `/product/find/id/<id>/` | Buscar producto por ID |
| `GET` | `/product/find/name/<nombre>/` | Buscar por nombre |
| `GET` | `/product/find/sku/<sku>/` | Buscar por SKU |
| `POST` | `/product/create/` | Crear nuevo producto |
| `PUT` | `/product/update/<id>/` | Actualizar producto |
| `DELETE` | `/product/delete/<id>/` | Eliminar producto |

### 👤 Autenticación (`/useraccount/`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/useraccount/login/` | Iniciar sesión |
| `POST` | `/useraccount/register/` | Registrar nuevo usuario |
| `POST` | `/useraccount/logout/` | Cerrar sesión |

## 🔐 Usuarios de Prueba

### Usuario Administrador (Solo Local)
- **Usuario/Email:** `admin` o `admin@funkopop.com`
- **Contraseña:** `admin123`
- **Permisos:** Acceso completo (crear, editar, eliminar productos)
- **Nota:** Este usuario NO existe en el backend, solo localmente

### Usuario Regular (Solo Local)
- **Usuario/Email:** `user` o `user@funkopop.com`
- **Contraseña:** `user123`
- **Permisos:** Solo ver productos y usar carrito
- **Nota:** Este usuario NO existe en el backend, solo localmente

## 📋 Diferencias entre API y Mock Data

### Campo `description` vs `product_description`

El backend usa el campo `product_description`, pero el frontend lo normaliza automáticamente a `description`:

```typescript
// El backend envía:
{
  "product_id": 1,
  "product_name": "Baby Yoda",
  "product_description": "Figura coleccionable...",
  ...
}

// El frontend lo convierte a:
{
  "product_id": 1,
  "product_name": "Baby Yoda",
  "description": "Figura coleccionable...",
  ...
}
```

### Precios

- **Mock data anterior:** Precios en pesos argentinos (ej: $15000)
- **Backend actual:** Precios con decimales (ej: $5200.99)

## 🖼️ Gestión de Imágenes

**IMPORTANTE:** Las imágenes se manejan localmente en el frontend, NO se cargan desde el backend.

### Estructura de imágenes:
```
public/multimedia/
  ├── star-wars/
  │   ├── baby-yoda-1.webp
  │   └── ...
  ├── pokemon/
  │   ├── pikachu-1.webp
  │   └── ...
  └── harry-potter/
      └── ...
```

El backend solo envía la ruta relativa (ej: `"star-wars/baby-yoda-1.webp"`), y el frontend las carga desde `public/multimedia/`.

## 🔄 Funcionamiento Híbrido

### ✅ Conectado al Backend
- **Productos:** Todos los datos vienen del backend
- **CRUD de Productos:** Todas las operaciones se sincronizan con el backend
- **Registro de usuarios:** Se guarda en el backend Y localmente

### 📦 Solo Local (localStorage)
- **Usuarios admin/user de prueba:** Solo existen localmente
- **Carrito de compras:** Se guarda solo en el navegador
- **Sesiones de usuario:** Se manejan con localStorage

### 🔀 Híbrido
- **Login:** Intenta validar con el backend, pero mantiene sesión local
- **Usuarios registrados:** Se guardan en ambos lugares

## 🧪 Probar la Conexión

### 1. Verificar que el backend esté activo

Abre en el navegador:
```
https://backend-shop-3btv.onrender.com/product/list/
```

Deberías ver un JSON con la lista de productos.

### 2. Verificar en la consola del navegador

1. Abre las DevTools (F12)
2. Ve a la pestaña "Network"
3. Recarga la página de productos
4. Busca las peticiones a `backend-shop-3btv.onrender.com`
5. Deberías ver respuestas exitosas (status 200)

## ⚠️ Problemas Comunes

### Error: "Failed to fetch"
**Causa:** El backend en Render puede estar inactivo (se duermen después de inactividad).

**Solución:** Espera unos 30 segundos a que Render reactive el servidor.

### Error: CORS
**Causa:** El backend no permite peticiones desde tu dominio.

**Solución:** Verifica la configuración CORS en el backend Django.

### No se cargan los productos
1. Abre la consola del navegador (F12)
2. Busca errores en la pestaña "Console"
3. Verifica que la URL en `.env` sea correcta
4. Confirma que reiniciaste el servidor después de crear `.env`

### Las imágenes no aparecen
1. Verifica que las imágenes existan en `public/multimedia/`
2. Los nombres deben coincidir EXACTAMENTE con los del backend
3. Las rutas son case-sensitive

## 🔧 Estructura del Código

### ProductContext.tsx
- `fetchProducts()`: Obtiene productos desde `/product/list/`
- `addProduct()`: Crea producto con POST a `/product/create/`
- `updateProduct()`: Actualiza con PUT a `/product/update/<id>/`
- `deleteProduct()`: Elimina con DELETE a `/product/delete/<id>/`

### AuthContext.tsx
- `register()`: Registra usuario con POST a `/useraccount/register/`
- `login()`: Valida credenciales con POST a `/useraccount/login/`
- Mantiene usuarios admin locales para facilitar testing

## 🚀 Mejoras Futuras Recomendadas

### Backend
- [ ] Implementar JWT tokens para autenticación
- [ ] Agregar sistema de roles (User, Admin)
- [ ] Endpoint para upload de imágenes
- [ ] Endpoints para gestión de carrito
- [ ] Agregar paginación en listados

### Frontend
- [ ] Migrar completamente autenticación al backend
- [ ] Implementar refresh tokens
- [ ] Interceptores HTTP para manejar tokens
- [ ] Mejorar manejo de errores con alertas visuales
- [ ] Agregar estados de carga más detallados
- [ ] Implementar caché de productos

## 📞 Soporte

Si tienes problemas con la conexión al backend, verifica:

1. ✅ El archivo `.env` existe y tiene la URL correcta
2. ✅ Reiniciaste el servidor después de crear `.env`
3. ✅ El backend en Render está activo (prueba la URL en el navegador)
4. ✅ No hay errores de CORS en la consola
5. ✅ Las imágenes están en la carpeta correcta

---

**Última actualización:** Noviembre 2025

