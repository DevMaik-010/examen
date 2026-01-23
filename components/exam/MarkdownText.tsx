"use client";

import ReactMarkdown from "react-markdown";

// ============================================
// COMPONENTE: MARKDOWN TEXT
// Renderiza texto en formato Markdown
// ============================================

interface MarkdownTextProps {
  children: string;
  className?: string;
}

export function MarkdownText({ children, className = "" }: MarkdownTextProps) {
  if (!children) {
    return null;
  }

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        components={{
          // Párrafos
          p: ({ children }) => (
            <p style={{ marginBottom: "1rem", lineHeight: 1.8 }}>{children}</p>
          ),

          // Encabezados
          h1: ({ children }) => (
            <h1
              style={{
                fontSize: "1.8rem",
                marginTop: "1.5rem",
                marginBottom: "1rem",
                color: "var(--text-accent)",
                fontWeight: "bold",
              }}
            >
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2
              style={{
                fontSize: "1.5rem",
                marginTop: "1.25rem",
                marginBottom: "0.75rem",
                color: "var(--text-accent)",
                fontWeight: "bold",
                borderBottom: "1px solid var(--border-card)",
                paddingBottom: "0.5rem",
              }}
            >
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3
              style={{
                fontSize: "1.25rem",
                marginTop: "1rem",
                marginBottom: "0.5rem",
                color: "var(--text-accent)",
                fontWeight: "bold",
              }}
            >
              {children}
            </h3>
          ),

          // Listas
          ul: ({ children }) => (
            <ul
              style={{
                marginLeft: "1.5rem",
                marginBottom: "1rem",
                listStyleType: "disc",
              }}
            >
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol
              style={{
                marginLeft: "1.5rem",
                marginBottom: "1rem",
                listStyleType: "decimal",
              }}
            >
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: "0.5rem" }}>{children}</li>
          ),

          // Énfasis
          strong: ({ children }) => (
            <strong
              style={{
                fontWeight: "bold",
                color: "var(--text-accent)",
              }}
            >
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em style={{ fontStyle: "italic" }}>{children}</em>
          ),

          // Citas
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: "4px solid var(--text-accent)",
                paddingLeft: "1rem",
                marginLeft: 0,
                marginBottom: "1rem",
                color: "var(--text-secondary)",
                fontStyle: "italic",
              }}
            >
              {children}
            </blockquote>
          ),

          // Código
          code: ({ children }) => (
            <code
              style={{
                backgroundColor: "rgba(0, 255, 255, 0.1)",
                padding: "0.2rem 0.4rem",
                borderRadius: "4px",
                fontSize: "0.9em",
                fontFamily: "var(--font-fira-code), monospace",
              }}
            >
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre
              style={{
                backgroundColor: "var(--bg-input)",
                padding: "1rem",
                borderRadius: "8px",
                overflow: "auto",
                marginBottom: "1rem",
              }}
            >
              {children}
            </pre>
          ),

          // Enlaces
          a: ({ href, children }) => (
            <a
              href={href}
              style={{
                color: "var(--text-accent)",
                textDecoration: "underline",
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          // Separador
          hr: () => (
            <hr
              style={{
                border: "none",
                borderTop: "2px solid var(--border-card)",
                margin: "1.5rem 0",
              }}
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
