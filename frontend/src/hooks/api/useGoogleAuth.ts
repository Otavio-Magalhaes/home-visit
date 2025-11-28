import type { HttpError } from "../../http/http-error";
import { loginGoogle, type TokenResponse } from "../../http/useLogin";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

export function useGoogleAuth() {
  const navigate = useNavigate();

  return useMutation<TokenResponse, HttpError, string>({
    mutationFn: (credential) => {
      return loginGoogle(credential);
    },

    onSuccess: (data) => {
      // 1. Salva o token
      localStorage.setItem("auth_token", data.access_token);
      
      // 2. Redireciona para o Dashboard (Rota protegida)
      // navigate("/dashboard"); 
      alert("Login realizado com sucesso! Token salvo. (Redirecionamento pendente)");
    },

    onError: (error) => {
      console.error("Erro no login:", error);
      // Aqui entraria o seu Toast
      alert(`Falha ao autenticar: ${error.message}`);
    },
  });
}