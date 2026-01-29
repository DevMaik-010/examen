import { useAuth } from '../../hooks/useAuth';

// ============================================
// COMPONENTE: BOTÓN DE CERRAR SESIÓN
// ============================================

export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button 
      onClick={logout}
      className="logout-btn"
    >
      🚪 Cerrar Sesión
    </button>
  );
}
