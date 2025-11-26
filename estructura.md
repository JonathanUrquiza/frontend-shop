# Estructura del proyecto - Frontend Shop

## Descripción General
Aplicación frontend creada en React + TypeScript para consumo y gestión del backend-shop (ecommerce). El foco está en la gestión/admin de productos (CRUD), autenticación y vistas públicas de catálogo.

## Estructura de carpetas y archivos principales

- `/src`
  - **index.tsx**: Entry point de la app, importa bootstrap y arranca React Router/App.
  - **App.tsx**: Configura todas las rutas principales y su layout general.
  - **/pages/**: Vistas principales (CRUD productos, login, etc).
    - `Login.tsx`: Vista y formulario de login.
    - `ProductList.tsx`: Listado de productos (catálogo o admin).
    - `ProductDetail.tsx`: Detalle de producto individual.
    - `ProductForm.tsx`: ABM/Creación y edición de producto.
    - `ProductDelete.tsx`: Confirmación/acción para eliminar producto.
  - **/components/**: Componentes reutilizables (Navbar, item de producto, etc).
    - `Navbar.tsx`: Barra de navegación superior con rutas a home, login y admin si el usuario es admin.
    
- Otros archivos auto generados:
  - **package.json, tsconfig.json, README.md, etc** (configuración estándar create-react-app TS)

## Notas
- Todo el routing y protección de vistas admin está pensado para estructurarse a medida que se agregue la autenticación y consumo real de API.
