import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useOutletContext } from 'react-router-dom';
import { Menu } from 'lucide-react';
import logo from '../../assets/react.svg'; 
import Sidebar from './Sidebar.js';
;

// 1. Definimos o "Contrato" do que esse Layout compartilha com as páginas filhas
type DashboardContextType = {
  filters: {
    latitude: number;
    longitude: number;
    radius_meters: number;
    tem_hipertensao: boolean | null;
    tem_diabetes: boolean | null;
    esta_gestante: boolean | null;
    esta_acamado: boolean | null;
    em_situacao_rua: boolean | null;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
};

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 2. O Estado dos Filtros SOBE para o Layout (Global para o Dashboard)
  const [filters, setFilters] = useState({
    latitude: -22.8971625,  
    longitude: -43.1067171,
    radius_meters: 5000,
    tem_hipertensao: null,
    tem_diabetes: null,
    esta_gestante: null,
    esta_acamado: null,
    em_situacao_rua: null
  });

  useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFilters(prev => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }));
            },
            (error) => console.error("Erro GPS:", error)
        );
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* Sidebar Fixa */}
      <Sidebar 
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        filters={filters}
        setFilters={setFilters}
        onLogout={handleLogout}
      />

      {/* Área de Conteúdo */}
      <div className={`flex-1 flex flex-col transition-all duration-300 `}>
        
        {/* Navbar Fixa no Topo */}
        <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <img alt="logo" width={24} src={logo} />
                    <h1 className="text-xl font-bold text-lasalle-blue">Home Visit</h1>
                </div>
            </div>
        </header>


        <main className="flex-1 p-6 overflow-y-auto">
            <Outlet context={{ filters, setFilters }} />
        </main>

      </div>
    </div>
  );
};

export function useDashboard() {
  return useOutletContext<DashboardContextType>();
}