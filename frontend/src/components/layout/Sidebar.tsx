import React, { useEffect, useState } from "react";
import {
  LogOut,
  MapPin,
  Filter,
  User as UserIcon,
  ChevronDown,
  ChevronRight,
  Home,
  HeartPulse,
  Users,
  AlertTriangle,
  ChartArea,
} from "lucide-react";

import { SidebarContent } from "../Sidebar/SidebarContent.js";
import type { FiltersType } from "@/@types/index.js";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet.js";
import { Button } from "../ui/button.js";
import { jwtDecode } from "jwt-decode";
import { exportDashboard } from "@/http/useExportRelatorio.js";



interface SidebarProps {
  filters: FiltersType;
  setFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  onLogout: () => void;
}

export default function Sidebar({ filters, setFilters, onLogout }: SidebarProps) {
  const [userInfo, setUserInfo] = useState<{ email: string; name?: string; role?: string } | null>(null);
  const [collapsed, setCollapsed] = useState(false); 
  const [sheetOpen, setSheetOpen] = useState(false); 
  const [isExporting, setIsExporting] = useState(false); 

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUserInfo({
          email: decoded.sub,
          name: decoded.name || decoded.sub?.split("@")[0],
          role: decoded.role,
        });
      } catch (e) {
        console.error("Erro ao decodificar token", e);
      }
    }
  }, []);

  const toggleCollapse = () => setCollapsed((v) => !v);

  const handleChange = (name: keyof FiltersType, value: any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };


  const handleExport = async () => {
    try {
        setIsExporting(true);
        // 1. Busca o BLOB do backend (Excel)
        const blob = await exportDashboard(filters);
        
        // 2. Cria uma URL temporária para esse blob
        const url = window.URL.createObjectURL(new Blob([blob]));
        
        // 3. Cria um link invisível e clica nele para forçar o download
        const link = document.createElement('a');
        link.href = url;
        const dateStr = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `relatorio_saude_${dateStr}.xlsx`);
        
        document.body.appendChild(link);
        link.click();
        
        // 4. Limpeza
        link.remove();
        window.URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error("Erro no download", error);
        alert("Não foi possível gerar o relatório. Tente novamente.");
    } finally {
        setIsExporting(false);
    }
  };

  return (
    <>
      {/* Mobile sheet trigger (visible on small screens) */}
      <div className="lg:hidden p-2">
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="w-10 h-10 p-0">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SidebarContent
              collapsed={false}
              onToggleCollapse={() => setCollapsed(false)}
              userInfo={userInfo}
              filters={filters}
              onChange={handleChange}
              onClose={() => setSheetOpen(false)}
              onLogout={onLogout}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen left-0 top-0 z-30 transition-all duration-300 bg-white border-r border-gray-100 ${
          collapsed ? "w-20" : "w-72"
        }`}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={toggleCollapse} aria-label="Abrir/Fechar sidebar" className="p-1">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        <SidebarContent
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          userInfo={userInfo}
          filters={filters}
          onChange={handleChange}
          onExport={handleExport}
          onLogout={onLogout}
          isExporting={isExporting}
        />
      </aside>
    </>
  );
}
