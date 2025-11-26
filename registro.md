# Registro de acciones - Frontend Shop

## Preparación del proyecto
- Se creó la carpeta `frontend-shop`.
- Se detectó que ya existía una instalación base de React+TypeScript con create-react-app.
- Se eliminaron archivos y recursos por defecto (logo, test, estilos, etc) para dejar limpio el proyecto y adaptarlo a la estructura propia.

## Instalación de bootstrap
- Se instaló Bootstrap como dependencia principal (`npm install bootstrap`).
- Se importó el css de Bootstrap en el entrypoint global (`index.tsx`).

## Estructura de carpetas y archivos
- Se creó la estructura de carpetas `/src/pages` y `/src/components`.
- Se generaron archivos base/componentes para:
  - Login
  - Listado de productos (ProductList)
  - Detalle de producto (ProductDetail)
  - Formulario de producto (ProductForm)
  - Eliminación de producto (ProductDelete)
  - Navegación (Navbar)

## Rutas principales
- Se configuró React Router en `App.tsx` con:
  - /login
  - /productos
  - /productos/:id
  - /admin/productos/new
  - /admin/productos/edit/:id
  - /admin/productos/delete/:id
  - / (home = listado productos)
- Se dejó preparado el Navbar y protección básica visual para área de administración.

## Pendiente
- Integrar lógica real de autenticación, proteger rutas y llenar de contenido los formularios, vistas de ABM productos.
