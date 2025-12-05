import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactElement;
    requireAdmin?: boolean;
    requireVendedor?: boolean;
    requireComprador?: boolean;
    allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    requireAdmin = false,
    requireVendedor = false,
    requireComprador = false,
    allowedRoles
}) => {
    const { isAuthenticated, isAdmin, isVendedor, isComprador, role } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Verificar roles específicos si se especifican
    if (allowedRoles && role && !allowedRoles.includes(role)) {
        return <Navigate to="/productos" replace />;
    }

    // Verificar permisos individuales
    if (requireAdmin && !isAdmin) {
        return <Navigate to="/productos" replace />;
    }

    if (requireVendedor && !isVendedor) {
        return <Navigate to="/productos" replace />;
    }

    if (requireComprador && !isComprador) {
        return <Navigate to="/productos" replace />;
    }

    return children;
};

export default ProtectedRoute;
