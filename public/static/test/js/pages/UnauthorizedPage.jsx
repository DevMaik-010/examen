import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// ============================================
// PÁGINA: ACCESO NO AUTORIZADO
// ============================================

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1); // Volver a la página anterior
  };

  const handleGoHome = () => {
    navigate('/instrucciones');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="view-container">
      <div className="card" style={{ textAlign: 'center', maxWidth: '500px' }}>
        {/* Ícono de advertencia */}
        <div style={{
          fontSize: '5rem',
          marginBottom: '1.5rem',
          animation: 'shake 0.5s'
        }}>
          🚫
        </div>

        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Acceso Denegado
        </h1>

        <p style={{ 
          fontSize: '1.1rem', 
          color: '#ff6b6b',
          marginBottom: '1.5rem'
        }}>
          No tienes permisos para acceder a esta página
        </p>

        <div className="tech-line"></div>

        {currentUser && (
          <div style={{ 
            marginBottom: '2rem',
            padding: '1rem',
            background: 'rgba(255, 200, 0, 0.1)',
            border: '1px solid rgba(255, 200, 0, 0.3)',
            borderRadius: '8px'
          }}>
            <p style={{ 
              color: '#ffc107',
              marginBottom: '0.5rem',
              fontSize: '0.9rem'
            }}>
              <strong>Usuario actual:</strong> {currentUser.username}
            </p>
            <p style={{ 
              color: '#ffc107',
              marginBottom: '0',
              fontSize: '0.9rem'
            }}>
              <strong>Rol:</strong> {currentUser.role}
            </p>
          </div>
        )}

        <div style={{ 
          marginBottom: '1.5rem',
          textAlign: 'left'
        }}>
          <p style={{ fontSize: '0.95rem', marginBottom: '0.8rem' }}>
            <strong>Posibles razones:</strong>
          </p>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0,
            color: '#b8c5d6',
            fontSize: '0.9rem'
          }}>
            <li style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#ff6b6b' }}>▸</span>
              Tu rol no tiene permisos para esta sección
            </li>
            <li style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#ff6b6b' }}>▸</span>
              La página requiere permisos adicionales
            </li>
            <li style={{ marginBottom: '0.5rem', paddingLeft: '1.5rem', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, color: '#ff6b6b' }}>▸</span>
              Tu cuenta puede estar desactivada
            </li>
          </ul>
        </div>

        <div className="tech-line"></div>

        {/* Botones de acción */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          flexDirection: 'column',
          alignItems: 'stretch'
        }}>
          <button 
            onClick={handleGoBack} 
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #00ffff 0%, #0096ff 100%)'
            }}
          >
            ← Volver Atrás
          </button>

          <button 
            onClick={handleGoHome}
            className="btn"
            style={{
              background: 'linear-gradient(135deg, #00ff88 0%, #00cc88 100%)'
            }}
          >
            🏠 Ir al Inicio
          </button>

          <button 
            onClick={handleLogout}
            style={{
              padding: '0.8rem 1.5rem',
              background: 'rgba(255, 50, 50, 0.2)',
              border: '1px solid rgba(255, 50, 50, 0.5)',
              borderRadius: '8px',
              color: '#ff6b6b',
              cursor: 'pointer',
              fontFamily: 'Fira Code, monospace',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'rgba(255, 50, 50, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'rgba(255, 50, 50, 0.2)';
            }}
          >
            🚪 Cerrar Sesión
          </button>
        </div>

        {/* Información de contacto */}
        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(0, 150, 255, 0.1)',
          border: '1px solid rgba(0, 150, 255, 0.3)',
          borderRadius: '8px'
        }}>
          <p style={{ 
            fontSize: '0.85rem',
            color: '#0096ff',
            marginBottom: 0
          }}>
            💡 Si crees que deberías tener acceso, contacta al administrador del sistema
          </p>
        </div>

        {/* Animación de shake */}
        <style>{`
          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            10%, 30%, 50%, 70%, 90% {
              transform: translateX(-10px);
            }
            20%, 40%, 60%, 80% {
              transform: translateX(10px);
            }
          }
        `}</style>
      </div>
    </div>
  );
}
