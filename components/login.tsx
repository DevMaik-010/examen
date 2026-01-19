import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isEmpty, setIsEmpty] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/instrucciones");
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const verificar = async () => {
      setIsEmpty(username === "" || password === "");
    };

    verificar();
  }, [username, password]);

  return (
    <div className="card">
      <div className="flex justify-center mb-8">
        <Image
          className=""
          src="/logomin.png"
          alt="Logo TechAssess"
          width={150}
          height={150}
          style={{
            filter:
              "drop-shadow(rgba(0, 255, 255, 0.3) 0px 0px 20px)",
          }}
        />
      </div><br />

      <h1 className="text-center">Educación Superior</h1>
      <div className="tech-line"></div>

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            className="input"
            placeholder="Usuario"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="input"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute right-4 top-[35%] transform -translate-y-1/2 cursor-pointer text-[1.2rem]"
            onClick={handleShowPassword}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <button type="submit" className="btn" disabled={isEmpty}>
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
