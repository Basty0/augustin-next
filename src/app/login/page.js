"use client"; // Ajoutez ceci en haut du fichier

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  function getCookie(name) {
    if (typeof document !== "undefined") {
      let value = `; ${document.cookie}`;
      let parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    }
    return null;
  }

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("https://lycee-augustin.mg/api/login", {
        email,
        password,
      });

      if (response.status === 200) {
        document.cookie = `userToken=${response.data.token}; `;
        router.push("/home");
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      alert(
        "Erreur de connexion. Veuillez vérifier vos identifiants et réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isClient) {
    return null; // ou un composant de chargement
  }

  const token = getCookie("userToken");

  if (token) {
    router.push("/home");
    return null;
  }

  console.log(document.cookie);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Connexion</h1>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Mot de passe</span>
          </label>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
        >
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </button>
      </div>
    </div>
  );
}
