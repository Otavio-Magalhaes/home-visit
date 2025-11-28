import React from 'react';
import logo from "../../assets/react.svg"; 
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

interface LoginFormProps {
  onSuccess: (credential: string) => void;
  onError: () => void;
  isLoading: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError, isLoading }) => {

  const handleGoogleResponse = (response: CredentialResponse) => {
    if (response.credential) {
      onSuccess(response.credential);
    } else {
      onError();
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 px-4 sm:px-6 lg:px-8 py-12 bg-white shadow-2xl rounded-2xl z-10">
      <div className="text-center">
        <img
          className="mx-auto h-16 w-auto"
          src={logo} // Usando o logo importado
          alt="Logo UniLaSalle"
        />
        <h2 className="mt-2 text-3xl font-extrabold text-lasalle-blue">
          Acesso Acadêmico
        </h2>
        <p className="mt-2 text-sm text-lasalle-yellow font-medium uppercase tracking-wider">
          Extensão em Enfermagem
        </p>
        <p className="mt-6 text-gray-500 text-base leading-relaxed">
          Utilize seu e-mail institucional da UniLaSalle para acessar o sistema de visitas.
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center justify-center min-h-[60px]">
        {isLoading ? (
            <div className="flex items-center gap-3 text-lasalle-blue font-semibold bg-gray-50 px-6 py-3 rounded-lg border border-gray-200">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Validando acesso...</span>
            </div>
        ) : (
            // O componente oficial garante o envio do 'credential' (JWT) correto para o backend
            <GoogleLogin
              onSuccess={handleGoogleResponse}
              onError={onError}
              theme="outline"
              size="large"
              width="300"
              text="signin_with"
              shape="pill"
              locale="pt_BR"
            />
        )}
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-gray-400">
          Ao entrar, você concorda com os termos de uso do projeto de extensão.
          <br/>Problemas de acesso? Contate a coordenação.
        </p>
      </div>
    </div>
  );
};