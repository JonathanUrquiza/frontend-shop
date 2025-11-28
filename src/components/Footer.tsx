import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="text-white text-center py-4 mt-auto">
            <div className="container">
                <p className="mb-0">&copy; {new Date().getFullYear()} Tienda Funkos. Todos los derechos reservados.</p>
                <div className="mt-2">
                    <a href="#" className="text-white-50 text-decoration-none mx-2">Términos</a>
                    <a href="#" className="text-white-50 text-decoration-none mx-2">Privacidad</a>
                    <a href="#" className="text-white-50 text-decoration-none mx-2">Contacto</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
