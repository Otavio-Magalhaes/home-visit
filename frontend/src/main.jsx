import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

const queryClient = new QueryClient()

// 1. Tenta carregar a variável
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ;

// 2. Debug de segurança no Console
if (!googleClientId) {
  console.error("ERRO: O Client ID do Google não foi encontrado!");
} else {
  console.log("✅ Google Client ID carregado:");
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <GoogleOAuthProvider clientId={googleClientId || ""}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>,
)