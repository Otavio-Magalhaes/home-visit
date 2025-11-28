import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

// 1. Tenta carregar a variável
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "980039787312-d294jfubmf61lu198uv10fslf3lnguus.apps.googleusercontent.com" ;

// 2. Debug de segurança no Console
if (!googleClientId) {
  console.error("🚨 ERRO CRÍTICO: O Client ID do Google não foi encontrado!");
  console.error("Verifique se você criou o arquivo .env na raiz do frontend e reiniciou o servidor.");
} else {
  console.log("✅ Google Client ID carregado:", googleClientId);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
)