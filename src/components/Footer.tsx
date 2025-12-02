import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="text-white text-center py-4 mt-auto">
            <div className="container">
                <p className="mb-0">&copy; {new Date().getFullYear()} Tienda Funkos. Todos los derechos reservados.</p>
                <div className="mt-2">
                    <button className="btn btn-link text-white-50 text-decoration-none mx-2 p-0 border-0" style={{background: 'none'}}>Términos</button>
                    <button className="btn btn-link text-white-50 text-decoration-none mx-2 p-0 border-0" style={{background: 'none'}}>Privacidad</button>
                    <button className="btn btn-link text-white-50 text-decoration-none mx-2 p-0 border-0" style={{background: 'none'}}>Contacto</button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
