import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logoMinEdu from '../assets/img/logo-minedu.png'

// ============================================
// PÁGINA: LOGIN CON AUTENTICACIÓN REAL
// ============================================

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/instrucciones', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Limpiar error cuando el usuario empieza a escribir
  useEffect(() => {
    if (error) {
      clearError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(username, password);

    if (result.success) {
      navigate('/instrucciones');
    }
    // El error se maneja automáticamente en el contexto
  };

  return (
    <div className="view-container">
      <div className="card">
        {/* Logo de la aplicación */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <img
            src={logoMinEdu}
            alt="Logo TechAssess"
            style={{
              width: '150px',
              height: '150px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.3))'
            }}
          />
        </div>

        <h1 style={{ textAlign: 'center' }}>Educación Superior</h1>
        {/* <p style={{ textAlign: 'center' }}>Prueba de admisión</p> */}
        <div className="tech-line"></div>

        {/* Mostrar error si existe */}
        {error && (
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 50, 50, 0.1)',
            border: '1px solid rgba(255, 50, 50, 0.3)',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            animation: 'shake 0.5s'
          }}>
            <p style={{
              color: '#ff6b6b',
              marginBottom: 0,
              fontSize: '0.9rem'
            }}>
              ⚠️ {typeof error === 'string' ? error : error?.message || 'Error de autenticación'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '35%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#00ffff',
                cursor: 'pointer',
                fontSize: '1.2rem',
                padding: '0.5rem'
              }}
              disabled={loading}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

              {/* adiciona 100% de ancho al boton */}
          <button
            type="submit"
            className="btn"
            disabled={loading || !username || !password}
          >
            {loading ? 'Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Animación de shake para errores */}
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
            .btn{
              width:100%
            }
        `}</style>
      </div>
    </div>
  );
}
