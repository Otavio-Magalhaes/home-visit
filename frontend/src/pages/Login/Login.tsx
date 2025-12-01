import React from 'react';
import NurseBG from '../../assets/nurse-bg.png'; // Certifique-se que o caminho está certo
import { useGoogleAuth } from '@/hooks/api/useGoogleAuth.js';
import { LoginForm } from './LoginForm.js';
import { toast } from "sonner"; 


const Login = () => {
  // 1. Chama o Hook
  const { mutate: login, isPending } = useGoogleAuth();

  // 2. Handlers
  const handleSuccess = (credential: string) => {
    login(credential);
  };

  const handleError = () => {
    toast.error("Erro na conexão com o Google. Tente novamente.");
  };

  return (
    <div className="min-h-screen bg-neutral-bg flex flex-col md:flex-row">
      
      <div className="hidden md:flex md:w-1/2 relative bg-lasalle-blue items-center justify-center overflow-hidden">
         <div 
            className="absolute inset-0 bg-cover bg-center z-0"
            style={{ backgroundImage: `url(${NurseBG})` }} 
         ></div>
         <div className="absolute inset-0 bg-nursing-gradient z-10"></div>

        <div className="relative z-20 p-12 text-white max-w-xl">
          <div>
                <h1 className="text-4xl font-bold tracking-tight mb-4">
                    Bem-vindo ao Projeto de Extensão
                </h1>
                <p className="text-lg text-nursing-light font-light leading-relaxed">
                    Tecnologia e cuidado unidos para transformar a saúde comunitária. 
                    Acesso exclusivo para estudantes e professores do projeto de extensão da UniLaSalle-RJ.
                </p>
                <div className="mt-8 flex space-x-2">
                    <div className="h-2 w-12 bg-lasalle-light rounded-full"></div> {/* Corrigi yellow para light do tema */}
                    <div className="h-2 w-4 bg-white rounded-full opacity-50"></div>
                </div>
          </div>
        </div>

        <svg className="absolute bottom-0 left-0 right-0 z-20 text-neutral-bg w-full h-24" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polygon points="0,100 100,0 100,100"/>
        </svg>
      </div>

      {/* LADO DIREITO */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-neutral-bg relative md:bg-transparent">
          <div className="md:hidden absolute top-0 left-0 right-0 h-48 bg-nursing-gradient rounded-b-[3rem]"></div>
          
          {/* Passamos as funções do hook para o form */}
          <LoginForm 
            onSuccess={handleSuccess} 
            onError={handleError} 
            isLoading={isPending} 
          />
          
          <footer className="mt-8 text-center text-sm text-gray-500 z-10">
            © 2025 UniLaSalle-RJ. Todos os direitos reservados.
          </footer>
          <footer className="mt-2 text-center text-xs text-gray-400 z-10">
            Desenvolvido por Otavio Magalhães • TCC Sistemas de Informação 2025
          </footer>
      </div>
    </div>
  );
};
 
export default Login;