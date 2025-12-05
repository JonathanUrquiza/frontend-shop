/**
 * Componente Footer - Pie de página de la aplicación.
 * 
 * Este componente renderiza el pie de página que se muestra en todas
 * las páginas de la aplicación. Incluye información de copyright y
 * enlaces a páginas legales.
 * 
 * Características:
 * - Copyright dinámico con el año actual
 * - Enlaces a Términos, Privacidad y Contacto (actualmente solo botones)
 * - Diseño responsive y consistente en toda la aplicación
 */

// Importar React para crear componentes
import React from 'react';

/**
 * Componente funcional Footer.
 * 
 * Renderiza el pie de página con información de copyright y enlaces legales.
 * 
 * @returns {JSX.Element} Componente de pie de página
 */
const Footer: React.FC = () => {
    return (
        <footer className="text-white text-center py-4 mt-auto">
            {/* Contenedor de Bootstrap para centrar contenido */}
            <div className="container">
                {/* Texto de copyright con año dinámico */}
                {/* new Date().getFullYear() obtiene el año actual automáticamente */}
                <p className="mb-0">&copy; {new Date().getFullYear()} Tienda Funkos. Todos los derechos reservados.</p>
                
                {/* Sección de enlaces legales */}
                <div className="mt-2">
                    {/* Botón de Términos (actualmente no tiene funcionalidad) */}
                    <button className="btn btn-link text-white-50 text-decoration-none mx-2 p-0 border-0" style={{background: 'none'}}>Términos</button>
                    
                    {/* Botón de Privacidad (actualmente no tiene funcionalidad) */}
                    <button className="btn btn-link text-white-50 text-decoration-none mx-2 p-0 border-0" style={{background: 'none'}}>Privacidad</button>
                    
                    {/* Botón de Contacto (actualmente no tiene funcionalidad) */}
                    <button className="btn btn-link text-white-50 text-decoration-none mx-2 p-0 border-0" style={{background: 'none'}}>Contacto</button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
