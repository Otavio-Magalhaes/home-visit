import type { HttpError } from "../../http/http-error";
import { loginGoogle, type TokenResponse } from "../../http/useLogin";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGoogleAuth() {
  const navigate = useNavigate();

  return useMutation<TokenResponse, HttpError, string>({
    mutationFn: (credential) => {
      return loginGoogle(credential);
    },

    onSuccess: (data) => {
      // 1. Salva o token
      localStorage.setItem("auth_token", data.access_token);
      
      // 2. Redirecionamento Inteligente
      // Se a tela for menor que 1024px (Tablet/Celular), manda pro App
      if (window.innerWidth < 1024) {
        navigate("/app/home");
      } else {
        // Se for Desktop, manda pro Dashboard
        navigate("/dashboard");
      }
    },


    onError: (error) => {
      console.error("Erro no login:", error);
      // Aqui entraria o seu Toast
      toast.error(`Falha ao autenticar: ${error.message}`);
    },
  });
}