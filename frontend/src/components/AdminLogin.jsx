import { useState } from "react";
import api from "../api";

export default function AdminLogin({ onLogin, onError }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      onError("Campos vacíos.");
      return;
    }

    try {
      const res = await api.post("/auth/login", { username, password });
      onLogin(res.data.token);
    } catch (error) {
      onError(error.response?.data?.message || "Error de acceso.");
    }
  };

  return (
    <main className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border shadow space-y-4">
        <h2 className="text-2xl font-bold">Acceso Administrador</h2>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Usuario" className="w-full border p-3 rounded-xl" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full border p-3 rounded-xl" />
        <button className="w-full px-5 py-3 rounded-xl bg-stone-900 text-white hover:cursor-pointer hover:scale-105">
          Ingresar
        </button>
      </form>
    </main>
  );
}