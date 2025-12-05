/**
 * Punto de entrada principal de la aplicación React.
 * 
 * Este archivo es el punto de entrada de la aplicación React. Se ejecuta
 * cuando la página se carga y renderiza el componente App en el elemento
 * con id 'root' del HTML.
 * 
 * Funciones principales:
 * - Inicializar React DOM
 * - Renderizar el componente App
 * - Importar estilos globales (Bootstrap y CSS personalizado)
 * - Habilitar React StrictMode para desarrollo
 */

// Importar React para crear componentes
import React from 'react';
// Importar ReactDOM para renderizar componentes en el DOM
import ReactDOM from 'react-dom/client';
// Importar el componente principal App
import App from './App';
// Importar estilos de Bootstrap (framework CSS)
import 'bootstrap/dist/css/bootstrap.min.css';
// Importar estilos personalizados de la aplicación
import './styles/index.css';

// Obtener el elemento root del HTML donde se renderizará la aplicación
// document.getElementById('root') busca el elemento con id 'root' en index.html
// ReactDOM.createRoot crea un root de React 18+ para renderizar componentes
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Renderizar la aplicación React en el elemento root
// React.StrictMode es un componente que ayuda a detectar problemas en desarrollo
// En producción, StrictMode no tiene efecto, solo en desarrollo
root.render(
  <React.StrictMode>
    {/* Componente principal de la aplicación */}
    {/* App contiene toda la estructura de rutas, providers y componentes */}
    <App />
  </React.StrictMode>
);
