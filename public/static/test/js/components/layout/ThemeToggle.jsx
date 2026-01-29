import { useTheme } from '../../hooks/useTheme';

// ============================================
// COMPONENTE: TOGGLE DE TEMA
// ============================================

export function ThemeToggle() {
  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Cambiar tema"
      title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {/* Sol (modo claro) */}
      <svg 
        className={`theme-icon sun ${!isDarkMode ? 'active' : ''}`}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>

      {/* Luna (modo oscuro) */}
      <svg 
        className={`theme-icon moon ${isDarkMode ? 'active' : ''}`}
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>

      {/* Estilos del componente */}
      <style>{`
        .theme-toggle {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--toggle-bg);
          border: 2px solid var(--toggle-border);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: 
            0 4px 20px var(--toggle-shadow),
            0 0 0 0 var(--toggle-border);
          z-index: 1000;
          overflow: hidden;
        }

        .theme-toggle:hover {
          transform: scale(1.1) rotate(10deg);
          box-shadow: 
            0 8px 30px var(--toggle-shadow-hover),
            0 0 0 4px var(--toggle-border-glow);
        }

        .theme-toggle:active {
          transform: scale(0.95) rotate(-5deg);
        }

        .theme-icon {
          position: absolute;
          width: 24px;
          height: 24px;
          transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .theme-icon.sun {
          color: #ffa500;
          transform: translateY(-40px) rotate(-180deg);
          opacity: 0;
        }

        .theme-icon.sun.active {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }

        .theme-icon.moon {
          color: #4a90e2;
          transform: translateY(40px) rotate(180deg);
          opacity: 0;
        }

        .theme-icon.moon.active {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }

        /* Animación de pulso en hover */
        @keyframes pulse {
          0%, 100% {
            box-shadow: 
              0 4px 20px var(--toggle-shadow),
              0 0 0 0 var(--toggle-border-glow);
          }
          50% {
            box-shadow: 
              0 4px 20px var(--toggle-shadow),
              0 0 0 8px var(--toggle-border-glow-pulse);
          }
        }

        .theme-toggle:hover {
          animation: pulse 2s infinite;
        }

        /* Variables de tema (se definen en globalStyles.js) */
        [data-theme="dark"] {
          --toggle-bg: rgba(20, 25, 45, 0.95);
          --toggle-border: rgba(0, 255, 255, 0.5);
          --toggle-shadow: rgba(0, 255, 255, 0.3);
          --toggle-shadow-hover: rgba(0, 255, 255, 0.5);
          --toggle-border-glow: rgba(0, 255, 255, 0.2);
          --toggle-border-glow-pulse: rgba(0, 255, 255, 0.1);
        }

        [data-theme="light"] {
          --toggle-bg: rgba(255, 255, 255, 0.95);
          --toggle-border: rgba(74, 144, 226, 0.5);
          --toggle-shadow: rgba(0, 0, 0, 0.1);
          --toggle-shadow-hover: rgba(0, 0, 0, 0.2);
          --toggle-border-glow: rgba(74, 144, 226, 0.2);
          --toggle-border-glow-pulse: rgba(74, 144, 226, 0.1);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .theme-toggle {
            width: 50px;
            height: 50px;
            bottom: 1.5rem;
            right: 1.5rem;
          }

          .theme-icon {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </button>
  );
}
