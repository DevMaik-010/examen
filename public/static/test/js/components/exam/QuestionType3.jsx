import { useState, useRef, useEffect } from "react";
import { LaTeXText } from "../common/LaTeXText";
import { MarkdownText } from "../common/MarkdownText";

// ============================================
// COMPONENTE: PREGUNTA TIPO 3 - SELECCIÓN SIMPLE
// COMPLETAMENTE ACCESIBLE PARA PERSONAS NO VIDENTES
// ============================================

export function QuestionType3({ question, currentAnswer, onAnswer }) {
  const [focusedIndex, setFocusedIndex] = useState(
    question.opciones.findIndex((opt) => opt === currentAnswer) || 0,
  );
  const [announcement, setAnnouncement] = useState("");
  const optionsRef = useRef([]);
  const articleRef = useRef(null);

  // Restablecer focus cuando cambia la pregunta
  useEffect(() => {
    const selectedIndex = question.opciones.findIndex(
      (opt) => opt === currentAnswer,
    );
    setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [question.id, currentAnswer, question.opciones]);

  const handleSelectOption = (option, index) => {
    onAnswer(option);
    setFocusedIndex(index);

    // Anuncio para lectores de pantalla
    const optionLetter = String.fromCharCode(65 + index);
    setAnnouncement(`Opción ${optionLetter} seleccionada: ${option}`);

    // Limpiar anuncio después de 1 segundo
    setTimeout(() => setAnnouncement(""), 1000);
  };

  const handleKeyDown = (e, index) => {
    const optionsCount = question.opciones.length;

    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        e.stopPropagation(); // ✅ Prevenir propagación
        const nextIndex = (index + 1) % optionsCount;
        setFocusedIndex(nextIndex);
        // Pequeño delay para asegurar que el focus se aplica correctamente
        setTimeout(() => {
          optionsRef.current[nextIndex]?.focus();
        }, 0);
        break;

      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        e.stopPropagation(); // ✅ Prevenir propagación
        const prevIndex = (index - 1 + optionsCount) % optionsCount;
        setFocusedIndex(prevIndex);
        // Pequeño delay para asegurar que el focus se aplica correctamente
        setTimeout(() => {
          optionsRef.current[prevIndex]?.focus();
        }, 0);
        break;

      case " ":
      case "Enter":
        e.preventDefault();
        e.stopPropagation(); // ✅ Prevenir propagación
        handleSelectOption(question.opciones[index], index);
        break;

      case "1":
      case "2":
      case "3":
      case "4":
        e.preventDefault();
        e.stopPropagation(); // ✅ Prevenir propagación
        const numIndex = parseInt(e.key) - 1;
        if (numIndex < optionsCount) {
          handleSelectOption(question.opciones[numIndex], numIndex);
          setTimeout(() => {
            optionsRef.current[numIndex]?.focus();
          }, 0);
        }
        break;

      case "a":
      case "b":
      case "c":
      case "d":
        e.preventDefault();
        e.stopPropagation(); // ✅ Prevenir propagación
        const letterIndex = e.key.charCodeAt(0) - 97;
        if (letterIndex < optionsCount) {
          handleSelectOption(question.opciones[letterIndex], letterIndex);
          setTimeout(() => {
            optionsRef.current[letterIndex]?.focus();
          }, 0);
        }
        break;

      case "Home":
        e.preventDefault();
        e.stopPropagation(); // ✅ Prevenir propagación
        setFocusedIndex(0);
        setTimeout(() => {
          optionsRef.current[0]?.focus();
        }, 0);
        break;

      case "End":
        e.preventDefault();
        e.stopPropagation(); // ✅ Prevenir propagación
        const lastIndex = optionsCount - 1;
        setFocusedIndex(lastIndex);
        setTimeout(() => {
          optionsRef.current[lastIndex]?.focus();
        }, 0);
        break;

      default:
        // No hacer nada para otras teclas
        break;
    }
  };

  return (
    <div
      className="question-type-3"
      role="region"
      aria-label={`Pregunta ${question.id}`}
    >
      {/* Región de anuncios para lectores de pantalla */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>

      {/* Mostrar artículo si existe (comprensión lectora) */}
      {question.articulo && (
        <section className="article-container" aria-labelledby="article-title">
          <h3 id="article-title" className="article-header">
            <span aria-hidden="true">📖</span>
            <span>Artículo de Lectura</span>
            <span
              className="scroll-indicator"
              role="note"
              aria-label="El artículo tiene scroll. Use las flechas o Page Down para navegar"
            >
              <span aria-hidden="true">↕️</span> Desliza para leer completo
            </span>
          </h3>

          <div
            ref={articleRef}
            className="article-content"
            tabIndex="0"
            role="article"
            aria-label={`Artículo completo. Use las flechas del teclado para desplazarse.`}
          >
            <MarkdownText>{question.articulo}</MarkdownText>
          </div>

          {/* Instrucción adicional para navegación del artículo */}
          <p className="sr-only">
            Fin del artículo. Presione Tab para continuar con las opciones de
            respuesta.
          </p>

          <div className="article-divider" aria-hidden="true"></div>
        </section>
      )}

      {/* Pregunta */}
      <div className="question-text" role="heading" aria-level="2" tabIndex="0">
        <LaTeXText>{question.pregunta}</LaTeXText>
      </div>

      {/* Instrucciones */}
      <div className="hint-text" id="question-instructions">
        <span aria-hidden="true">💡</span>
        <span>
          Selecciona una sola opción.
          <span className="sr-only">
            Usa las flechas para navegar, Enter o Espacio para seleccionar, o
            presiona 1-4 o A-D para seleccionar directamente.
          </span>
          <span aria-hidden="true"> (Usa flechas ↑↓ o teclas 1-4 / A-D)</span>
        </span>
      </div>

      {/* Opciones como radiogroup */}
      <div
        className="options-list"
        role="radiogroup"
        aria-labelledby="question-text"
        aria-describedby="question-instructions"
        aria-required="true"
      >
        {question.opciones.map((option, index) => {
          const isSelected = currentAnswer === option;
          const isFocused = focusedIndex === index;
          const optionLetter = String.fromCharCode(65 + index); // A, B, C, D

          return (
            <div
              key={index}
              ref={(el) => (optionsRef.current[index] = el)}
              className={`option-item ${isSelected ? "selected" : ""} ${isFocused ? "focused" : ""}`}
              role="radio"
              aria-checked={isSelected}
              aria-label={`Opción ${optionLetter}: ${option}. ${isSelected ? "Seleccionada" : "No seleccionada"}. ${index + 1} de ${question.opciones.length}.`}
              tabIndex={isFocused ? 0 : -1}
              onClick={() => handleSelectOption(option, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              {/* Radio visual */}
              <span className="option-radio" aria-hidden="true">
                {isSelected ? "⦿" : "○"}
              </span>

              {/* Letra de la opción */}
              <span className="option-letter" aria-hidden="true">
                {optionLetter}
              </span>

              {/* Texto de la opción */}
              <span className="option-text">
                <LaTeXText>{option}</LaTeXText>
              </span>

              {/* Estado para lectores de pantalla */}
              <span className="sr-only">
                {isSelected && "(Seleccionada)"}
                {` - Presione Enter para ${isSelected ? "confirmar" : "seleccionar"}`}
              </span>
            </div>
          );
        })}
      </div>

      {/* Información adicional para lectores de pantalla */}
      <div className="sr-only" role="status" aria-live="polite">
        {currentAnswer
          ? `Respuesta seleccionada: ${currentAnswer}`
          : "No hay respuesta seleccionada"}
      </div>

      <style>{`
        /* Clase para contenido solo visible para lectores de pantalla */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }

        .question-type-3 {
          width: 100%;
          position: relative;
        }

        .article-container {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--bg-input);
          border-radius: 12px;
          border: 2px solid var(--border-card);
        }

        .article-header {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-accent);
          margin: 0 0 1rem 0;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--border-card);
          font-family: 'Orbitron', sans-serif;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .scroll-indicator {
          font-size: 0.85rem;
          font-weight: 500;
          color: #0099ffff;
          background: rgba(0, 255, 255, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          border: 1px solid rgba(0, 255, 255, 0.3);
          font-family: 'Fira Code', monospace;
          animation: pulse-scroll 2s ease-in-out infinite;
        }

        @keyframes pulse-scroll {
          0%, 100% {
            opacity: 1;
            transform: translateY(0);
          }
          50% {
            opacity: 0.7;
            transform: translateY(2px);
          }
        }

        .article-content {
          font-size: 1rem;
          line-height: 1.8;
          color: var(--text-primary);
          max-height: 400px;
          overflow-y: auto;
          padding-right: 1rem;
          margin-bottom: 1rem;
          box-shadow: inset 0 -10px 10px -10px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        /* Focus visible en el artículo */
        .article-content:focus {
          outline: 3px solid var(--text-accent);
          outline-offset: 2px;
        }

        /* Scrollbar mejorado */
        .article-content::-webkit-scrollbar {
          width: 14px;
        }

        .article-content::-webkit-scrollbar-track {
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.2);
          border-radius: 7px;
          margin: 4px 0;
        }

        .article-content::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #00ffff 0%, #00cccc 100%);
          border-radius: 7px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          box-shadow: 0 2px 6px rgba(0, 255, 255, 0.4);
        }

        .article-content::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #00ffff 0%, #00aaaa 100%);
          box-shadow: 0 2px 8px rgba(0, 255, 255, 0.6);
        }

        .article-divider {
          height: 2px;
          background: linear-gradient(to right, var(--primary), transparent);
          margin-top: 1rem;
        }

        .question-text {
          font-size: 1.2rem;
          line-height: 1.8;
          color: var(--text-primary);
          margin-bottom: 1rem;
          padding: 1.5rem;
          background: var(--bg-input);
          border-left: 4px solid var(--text-accent);
          border-radius: 8px;
        }

        .question-text:focus {
          outline: 3px solid var(--text-accent);
          outline-offset: 2px;
        }

        .hint-text {
          font-size: 0.9rem;
          color: var(--text-accent);
          margin-bottom: 1.5rem;
          font-style: italic;
        }

        .options-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .option-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.2rem 1.5rem;
          font-family: 'Fira Code', monospace;
          font-size: 1rem;
          border: 2px solid var(--border-input);
          border-radius: 10px;
          background: var(--bg-card);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
        }

        /* Focus visible muy claro */
        .option-item:focus {
          outline: 3px solid var(--text-accent);
          outline-offset: 3px;
          border-color: var(--text-accent);
        }

        .option-item.focused {
          border-color: var(--text-accent);
          box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.2);
        }

        .option-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
          transition: left 0.5s;
        }

        .option-item:hover::before {
          left: 100%;
        }

        .option-item:hover {
          border-color: var(--text-accent);
          transform: translateX(8px);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }

        .option-radio {
          font-size: 2rem;
          min-width: 30px;
          text-align: center;
          color: var(--text-accent);
          line-height: 1;
        }

        .option-letter {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-accent);
          min-width: 30px;
          text-align: center;
          background: rgba(0, 255, 255, 0.1);
          border-radius: 6px;
          padding: 0.25rem 0.5rem;
        }

        .option-text {
          flex: 1;
          line-height: 1.6;
        }

        .option-item.selected {
          background: linear-gradient(
            135deg,
            var(--bg-badge),
            rgba(var(--text-accent-rgb), 0.15)
          );
          border-color: var(--text-accent);
          border-width: 3px;
          box-shadow: 
            0 0 25px rgba(0, 255, 255, 0.3),
            inset 0 0 20px rgba(0, 255, 255, 0.1);
          transform: translateX(8px) scale(1.02);
        }

        [data-theme="light"] .option-item.selected {
          box-shadow: 
            0 0 25px rgba(37, 99, 235, 0.3),
            inset 0 0 20px rgba(37, 99, 235, 0.1);
        }

        .option-item.selected .option-radio {
          animation: pulse-radio 1s ease-in-out;
        }

        .option-item.selected .option-letter {
          background: var(--text-accent);
          color: var(--bg-card);
        }

        @keyframes pulse-radio {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .article-container {
            padding: 1rem;
          }

          .article-header {
            font-size: 1rem;
            flex-direction: column;
            align-items: flex-start;
          }

          .scroll-indicator {
            font-size: 0.75rem;
            padding: 0.2rem 0.5rem;
            width: 100%;
            text-align: center;
          }

          .article-content {
            max-height: 300px;
            font-size: 0.95rem;
          }

          .question-text {
            font-size: 1rem;
            padding: 1rem;
          }

          .option-item {
            padding: 1rem;
            font-size: 0.9rem;
          }

          .option-radio {
            font-size: 1.6rem;
          }

          .option-letter {
            font-size: 1rem;
            min-width: 25px;
          }

          .option-item:hover,
          .option-item.selected {
            transform: translateX(5px);
          }
        }

        /* Alta visibilidad para bajo contraste */
        @media (prefers-contrast: high) {
          .option-item:focus {
            outline-width: 4px;
          }
          
          .article-content:focus,
          .question-text:focus {
            outline-width: 4px;
          }
        }
      `}</style>
    </div>
  );
}
