import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import InstruccionesPage from '../pages/InstruccionesPage';
import PruebaPage from '../pages/PruebaPage';
import FinPage from '../pages/FinPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

// ============================================
// CONFIGURACIÓN DE RUTAS CON AUTENTICACIÓN (EN ESPAÑOL)
// ============================================

export function AppRoutes() {
  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* Página de acceso denegado */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      {/* Rutas protegidas - Requieren autenticación */}
      <Route 
        path="/instrucciones" 
        element={
          <ProtectedRoute>
            <InstruccionesPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta protegida - Prueba/Examen */}
      <Route 
        path="/prueba" 
        element={
          <ProtectedRoute>
            <PruebaPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Ruta protegida - Finalización del examen */}
      <Route 
        path="/fin" 
        element={
          <ProtectedRoute>
            <FinPage />
          </ProtectedRoute>
        } 
      />

      {/* 
        EJEMPLOS DE RUTAS PROTEGIDAS POR ROL (para implementación futura):
        
        Ruta solo para administradores:
        <Route 
          path="/admin" 
          element={
            <RoleBasedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </RoleBasedRoute>
          } 
        />

        Ruta para profesores y administradores:
        <Route 
          path="/manage-exams" 
          element={
            <RoleBasedRoute allowedRoles={['admin', 'teacher']}>
              <ManageExams />
            </RoleBasedRoute>
          } 
        />

        Ruta basada en permisos específicos:
        <Route 
          path="/results" 
          element={
            <PermissionBasedRoute 
              requiredPermissions={['results.view_all']}
            >
              <AllResults />
            </PermissionBasedRoute>
          } 
        />
      */}
      
      {/* Redirecciones */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
