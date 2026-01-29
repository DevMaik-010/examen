// ============================================
// ESTILOS GLOBALES CON SOPORTE DE TEMAS
// ============================================

export const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700;900&family=Fira+Code:wght@300;400;500&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ============================================
     VARIABLES DE TEMA - MODO OSCURO (DEFAULT)
     ============================================ */
  [data-theme="dark"] {
    /* Fondos */
    --bg-primary: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
    --bg-card: rgba(20, 25, 45, 0.8);
    --bg-input: rgba(10, 14, 39, 0.6);
    --bg-badge: rgba(0, 255, 255, 0.1);
    --bg-success: rgba(0, 255, 100, 0.1);
    --bg-error: rgba(255, 50, 50, 0.1);
    --bg-warning: rgba(255, 200, 0, 0.1);
    --bg-info: rgba(0, 150, 255, 0.1);
    
    /* Bordes */
    --border-card: rgba(0, 255, 255, 0.2);
    --border-input: rgba(0, 255, 255, 0.3);
    --border-badge: rgba(0, 255, 255, 0.3);
    --border-success: rgba(0, 255, 100, 0.3);
    --border-error: rgba(255, 50, 50, 0.3);
    --border-warning: rgba(255, 200, 0, 0.3);
    --border-info: rgba(0, 150, 255, 0.3);
    
    /* Textos */
    --text-primary: #e0e6ed;
    --text-secondary: #b8c5d6;
    --text-muted: #6b7280;
    --text-accent: #00ffff;
    --text-gradient-start: #00ffff;
    --text-gradient-end: #0096ff;
    
    /* Sombras */
    --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.3), 
                   0 0 80px rgba(0, 255, 255, 0.1),
                   inset 0 0 80px rgba(0, 255, 255, 0.03);
    --shadow-button: 0 4px 15px rgba(0, 255, 255, 0.3);
    --shadow-button-hover: 0 8px 25px rgba(0, 255, 255, 0.5);
    
    /* Efectos de partículas */
    --particle-1: rgba(0, 255, 255, 0.03);
    --particle-2: rgba(0, 150, 255, 0.03);
    --particle-3: rgba(138, 43, 226, 0.02);
  }

  /* ============================================
     VARIABLES DE TEMA - MODO CLARO
     ============================================ */
  [data-theme="light"] {
    /* Fondos */
    --bg-primary: linear-gradient(135deg, #f0f4f8 0%, #e1e8ed 100%);
    --bg-card: rgba(255, 255, 255, 0.95);
    --bg-input: rgba(240, 244, 248, 0.8);
    --bg-badge: rgba(74, 144, 226, 0.1);
    --bg-success: rgba(0, 200, 80, 0.1);
    --bg-error: rgba(220, 38, 38, 0.1);
    --bg-warning: rgba(245, 158, 11, 0.1);
    --bg-info: rgba(59, 130, 246, 0.1);
    
    /* Bordes */
    --border-card: rgba(74, 144, 226, 0.2);
    --border-input: rgba(74, 144, 226, 0.8);
    --border-badge: rgba(74, 144, 226, 0.3);
    --border-success: rgba(0, 200, 80, 0.3);
    --border-error: rgba(220, 38, 38, 0.3);
    --border-warning: rgba(245, 158, 11, 0.3);
    --border-info: rgba(59, 130, 246, 0.3);
    
    /* Textos */
    --text-primary: #1a202c;
    --text-secondary: #4a5568;
    --text-muted: #a0aec0;
    --text-accent: #2563eb;
    --text-gradient-start: #2563eb;
    --text-gradient-end: #1d4ed8;
    
    /* Sombras */
    --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.08),
                   0 0 40px rgba(74, 144, 226, 0.05),
                   inset 0 0 40px rgba(74, 144, 226, 0.02);
    --shadow-button: 0 4px 12px rgba(37, 99, 235, 0.2);
    --shadow-button-hover: 0 8px 20px rgba(37, 99, 235, 0.3);
    
    /* Efectos de partículas */
    --particle-1: rgba(74, 144, 226, 0.03);
    --particle-2: rgba(37, 99, 235, 0.03);
    --particle-3: rgba(147, 51, 234, 0.02);
  }

  body {
    font-family: 'Fira Code', monospace;
    background: var(--bg-primary);
    color: var(--text-primary);
    min-height: 100vh;
    overflow-x: hidden;
    transition: background 0.3s ease, color 0.3s ease;
  }

  .exam-app {
    min-height: 100vh;
    position: relative;
  }

  /* Efecto de partículas de fondo */
  .exam-app::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 50%, var(--particle-1) 0%, transparent 50%),
      radial-gradient(circle at 80% 80%, var(--particle-2) 0%, transparent 50%),
      radial-gradient(circle at 40% 20%, var(--particle-3) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  /* Estilos base para contenedores */
  .view-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    z-index: 1;
  }

  .card {
    background: var(--bg-card);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-card);
    border-radius: 16px;
    padding: 3rem;
    max-width: 700px;
    width: 100%;
    box-shadow: var(--shadow-card);
    animation: cardEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    transition: all 0.3s ease;
  }

  @keyframes cardEntrance {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Tipografía */
  h1, h2 {
    font-family: 'Orbitron', sans-serif;
    background: linear-gradient(135deg, var(--text-gradient-start) 0%, var(--text-gradient-end) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1.5rem;
    font-weight: 700;
    letter-spacing: 1px;
  }

  h1 {
    font-size: 2.5rem;
    text-transform: uppercase;
  }

  h2 {
    font-size: 1.8rem;
  }

  p {
    line-height: 1.8;
    color: var(--text-secondary);
    margin-bottom: 1rem;
  }

  /* Botones */
  .btn {
    font-family: 'Fira Code', monospace;
    background: linear-gradient(135deg, var(--text-gradient-start) 0%, var(--text-gradient-end) 100%);
    color: var(--bg-card);
    border: none;
    padding: 1rem 2.5rem;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    text-transform: uppercase;
    letter-spacing: 1px;
    position: relative;
    overflow: hidden;
    box-shadow: var(--shadow-button);
  }

  .btn::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  .btn:hover::before {
    width: 300px;
    height: 300px;
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-button-hover);
  }

  .btn:active {
    transform: translateY(0);
  }

  .btn:disabled {
    background: var(--bg-input);
    color: var(--text-muted);
    cursor: not-allowed;
    box-shadow: none;
  }

  .btn:disabled:hover {
    transform: none;
  }

  /* Botón de logout */
  .logout-btn {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: var(--bg-error);
    border: 1px solid var(--border-error);
    color: #ff6b6b;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.85rem;
    font-family: 'Fira Code', monospace;
    transition: all 0.3s ease;
    font-weight: 500;
  }

  [data-theme="light"] .logout-btn {
    color: #dc2626;
  }

  .logout-btn:hover {
    background: rgba(255, 50, 50, 0.3);
    transform: scale(1.05);
  }

  [data-theme="light"] .logout-btn:hover {
    background: rgba(220, 38, 38, 0.2);
  }

  /* Input fields */
  input {
    width: 100%;
    padding: 1rem;
    font-family: 'Fira Code', monospace;
    font-size: 1rem;
    background: var(--bg-input);
    border: 1px solid var(--border-input);
    border-radius: 8px;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
  }

  input:focus {
    outline: none;
    border-color: var(--text-accent);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
  }

  [data-theme="light"] input:focus {
    box-shadow: 0 0 20px rgba(74, 144, 226, 0.2);
  }

  input::placeholder {
    color: var(--text-muted);
  }

  /* Decoraciones */
  .tech-line {
    height: 2px;
    background: linear-gradient(90deg, transparent 0%, var(--text-accent) 50%, transparent 100%);
    margin: 2rem 0;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }

  .status-badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: var(--bg-badge);
    border: 1px solid var(--border-badge);
    border-radius: 20px;
    font-size: 0.85rem;
    color: var(--text-accent);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 1rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .card {
      padding: 2rem;
    }

    h1 {
      font-size: 2rem;
    }

    h2 {
      font-size: 1.5rem;
    }
  }
`;
