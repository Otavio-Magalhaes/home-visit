import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Cloud, CloudOff, RefreshCw } from 'lucide-react';
import logo from '../../assets/react.svg'; 
import { useSync } from '@/hooks/useAsync.js';
import { Button } from '../ui/button.js';

export const MobileLayout = () => {
  const navigate = useNavigate();
  const { isOnline, isSyncing, syncNow, pendingCount } = useSync();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* Header Fixo */}
      <header className="bg-lasalle-blue text-white shadow-md sticky top-0 z-50">
        <div className="px-4 h-16 flex justify-between items-center">
          
          {/* Logo e Marca */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={ () => navigate('/app/home')}>
             <img src={logo} alt="Logo" className="h-8 w-8" />
             <span className="font-bold text-lg tracking-tight">Home Visit</span>
            </Button>
          </div>

          {/* Área de Ações (Sync e Logout) */}
          <div className="flex items-center gap-4">
            
            {/* Botão de Sincronização */}
            <button 
                onClick={syncNow} 
                className="relative p-1 rounded-full hover:bg-white/10 transition-colors"
                disabled={isSyncing || !isOnline}
            >
                {isSyncing ? (
                    <RefreshCw className="animate-spin text-yellow-300" size={24} />
                ) : isOnline ? (
                    <Cloud className="text-green-300" size={24} />
                ) : (
                    <CloudOff className="text-red-300" size={24} />
                )}

                {/* Bolinha vermelha com contador de pendências */}
                {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-lasalle-blue">
                        {pendingCount}
                    </span>
                )}
            </button>

            <button onClick={handleLogout} className="p-1 hover:bg-white/10 rounded-full">
              <LogOut size={24} />
            </button>
          </div>
        </div>

        {/* Barra de Aviso Offline */}
        {!isOnline && (
            <div className="bg-orange-500 text-white text-xs font-medium text-center py-1">
                Modo Offline • Dados salvos no dispositivo
            </div>
        )}
      </header>

      {/* Conteúdo da Página (Outlet) */}
      <main className="flex-1 p-4 pb-20 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};