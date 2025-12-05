/**
 * Componente ProtectedRoute - Protección de rutas basada en autenticación y roles.
 * 
 * Este componente protege rutas que requieren autenticación y/o roles específicos.
 * Si el usuario no cumple con los requisitos, es redirigido automáticamente.
 * 
 * Uso:
 * <ProtectedRoute requireAdmin={true}>
 *   <AdminPage />
 * </ProtectedRoute>
 * 
 * O con roles específicos:
 * <ProtectedRoute allowedRoles={['admin', 'vendedor']}>
 *   <ProductForm />
 * </ProtectedRoute>
 */

// Importar React para crear componentes
import React from 'react';
// Importar Navigate de react-router-dom para redirecciones
import { Navigate } from 'react-router-dom';
// Importar hook useAuth y tipo UserRole del contexto de autenticación
import { useAuth, UserRole } from '../context/AuthContext';

/**
 * Props del componente ProtectedRoute.
 * 
 * @interface ProtectedRouteProps
 * @property {React.ReactElement} children - Componente hijo a renderizar si se cumplen los permisos
 * @property {boolean} [requireAdmin] - Si es true, requiere rol de administrador
 * @property {boolean} [requireVendedor] - Si es true, requiere rol de vendedor (o admin/mixto)
 * @property {boolean} [requireComprador] - Si es true, requiere rol de comprador (o admin/mixto)
 * @property {UserRole[]} [allowedRoles] - Array de roles permitidos (preferido sobre require*)
 */
interface ProtectedRouteProps {
    children: React.ReactElement;  // Componente hijo a proteger
    requireAdmin?: boolean;  // Requiere rol admin
    requireVendedor?: boolean;  // Requiere rol vendedor (o admin/mixto)
    requireComprador?: boolean;  // Requiere rol comprador (o admin/mixto)
    allowedRoles?: UserRole[];  // Lista de roles permitidos (más flexible)
}

/**
 * Componente ProtectedRoute.
 * 
 * Protege rutas verificando:
 * 1. Si el usuario está autenticado
 * 2. Si el usuario tiene el rol requerido (si se especifica)
 * 
 * Si no cumple los requisitos, redirige a /login o /productos según corresponda.
 * 
 * @param {ProtectedRouteProps} props - Props del componente
 * @returns {JSX.Element} Componente hijo si tiene permisos, o redirección si no
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children,  // Componente hijo a renderizar
    requireAdmin = false,  // Por defecto no requiere admin
    requireVendedor = false,  // Por defecto no requiere vendedor
    requireComprador = false,  // Por defecto no requiere comprador
    allowedRoles  // Roles permitidos (undefined por defecto)
}) => {
    // Obtener estado de autenticación y permisos del contexto
    const { isAuthenticated, isAdmin, isVendedor, isComprador, role } = useAuth();

    // Si el usuario no está autenticado, redirigir a la página de login
    if (!isAuthenticated) {
        // replace: true reemplaza la entrada en el historial en lugar de agregar una nueva
        return <Navigate to="/login" replace />;
    }

    // Verificar roles específicos si se especifican (método preferido)
    // Si se proporciona allowedRoles y el usuario tiene un rol, verificar que esté en la lista
    if (allowedRoles && role && !allowedRoles.includes(role)) {
        // Si el rol del usuario no está en la lista permitida, redirigir a productos
        return <Navigate to="/productos" replace />;
    }

    // Verificar permisos individuales (método legacy, mantenido para compatibilidad)
    // Si requiere admin y el usuario no es admin, redirigir
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/productos" replace />;
    }

    // Si requiere vendedor y el usuario no tiene permisos de vendedor, redirigir
    // Nota: isVendedor incluye admin y mixto automáticamente
    if (requireVendedor && !isVendedor) {
        return <Navigate to="/productos" replace />;
    }

    // Si requiere comprador y el usuario no tiene permisos de comprador, redirigir
    // Nota: isComprador incluye admin y mixto automáticamente
    if (requireComprador && !isComprador) {
        return <Navigate to="/productos" replace />;
    }

    // Si pasa todas las validaciones, renderizar el componente hijo
    return children;
};

export default ProtectedRoute;
