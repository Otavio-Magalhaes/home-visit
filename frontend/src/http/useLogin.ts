import { HttpError } from "./http-error";

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

/**
 * Realiza a troca do token do Google pelo JWT da aplicação.
 * Nota: Não precisa de authenticatedFetch pois é uma rota pública.
 */
export async function loginGoogle(credential: string): Promise<TokenResponse> {
  
  const response = await fetch(
    `${BASE_URL}/auth/google`, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential }),
    }
  );

  if (!response.ok) {
    let message = "Ocorreu um erro ao realizar o login.";
    try {
      const errorBody = await response.json();
      message = errorBody.detail || message;
    } catch (_) {
      message = `${response.status} ${response.statusText}`;
    }
    throw new HttpError(message, response.status);
  }

  return response.json();
}