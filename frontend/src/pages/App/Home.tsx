import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, User, FileText, ChevronRight, RefreshCw, Clock, DownloadCloud, Home } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { useLiveQuery } from 'dexie-react-hooks'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Button } from '@/components/ui/button.js';
import { Separator } from '@radix-ui/react-separator';
import { Badge } from '@/components/ui/badge.js';
import QuickActionCard from '@/components/QuickCardAction.js';
import { db } from '@/lib/db.js';
import { useSync } from '@/hooks/useAsync.js';

// Componentes shadcn/ui

const AppHome = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Estudante");
  const { syncDown, isDownloading, isOnline } = useSync(); 

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        try {
            const decoded: any = jwtDecode(token);
            setUserName(decoded.name || decoded.sub?.split('@')[0]);
        } catch (e) {
            console.error("Erro token", e);
        }
    }
  }, []);

  const recentActivity = useLiveQuery(() => 
    db.syncQueue
      .reverse() 
      .limit(10) 
      .toArray()
  );

  const getItemDisplay = (item: any) => {
    switch (item.tipo) {
        case 'residencia':
            return {
                icon: <Home size={18} className="text-blue-600" />,
                title: "Nova Residência",
                subtitle: item.payload.nome_logradouro ? `${item.payload.nome_logradouro}, ${item.payload.numero}` : "Endereço registrado"
            };
        case 'morador':
            return {
                icon: <User size={18} className="text-purple-600" />,
                title: "Novo Morador",
                subtitle: item.payload.nome_completo || "Cidadão cadastrado"
            };
        case 'visita':
            return {
                icon: <FileText size={18} className="text-orange-500" />,
                title: "Visita Domiciliar",
                subtitle: item.payload.desfecho === 'REALIZADA' ? "Realizada com sucesso" : `Status: ${item.payload.desfecho}`
            };
        default:
            return {
                icon: <Clock size={18} className="text-gray-500" />,
                title: "Atividade",
                subtitle: "Registro salvo"
            };
    }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* Card Boas Vindas */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
                <div>
                    <CardTitle className="text-xl font-bold text-gray-800">Olá, {userName}!</CardTitle>
                    <CardDescription>Pronto(a) para iniciar as visitas?</CardDescription>
                </div>
                <Button 
                    variant="outline" size="sm" onClick={syncDown} disabled={isDownloading || !isOnline}
                    className="text-xs gap-2 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100"
                >
                    {isDownloading ? <RefreshCw className="h-3 w-3 animate-spin" /> : <DownloadCloud className="h-3 w-3" />}
                    {isDownloading ? "Baixando..." : "Atualizar"}
                </Button>
            </div>
        </CardHeader>
      </Card>

      {/* Botão Gigante */}
      <Button 
        onClick={() => navigate('/app/nova-visita')} 
        className="w-full h-16 text-lg bg-lasalle-blue hover:bg-blue-900 shadow-md rounded-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
      >
        <Plus size={28} className="text-yellow-400" />
        <span className="font-semibold tracking-wide">Iniciar Nova Visita</span>
      </Button>

      {/* Atalhos */}
      <div className="grid grid-cols-2 gap-4">
        <QuickActionCard 
            icon={<MapPin size={24} className="text-green-600" />}
            label="Nova Residência"
            bgColor="bg-green-50"
            borderColor="border-green-100"
            onClick={() => navigate('/app/nova-residencia')}
        />
        <QuickActionCard 
            icon={<User size={24} className="text-purple-600" />}
            label="Novo Morador"
            bgColor="bg-purple-50"
            borderColor="border-purple-100"
            onClick={() => navigate('/app/novo-morador')}
        />
      </div>

      <Separator className="my-4" />

      {/* 2. Lista de Atividades (Mista) */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
            <h2 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                <Clock size={16} className="text-lasalle-blue" />
                Últimas Atividades
            </h2>
            <Badge variant="secondary" className="text-xs font-normal">
                {recentActivity?.length || 0}
            </Badge>
        </div>
        
        <div className="space-y-3">
            {(!recentActivity || recentActivity.length === 0) && (
                <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-400 text-sm">Nenhuma atividade recente.</p>
                </div>
            )}

            {recentActivity?.map((item: any) => {
                const display = getItemDisplay(item);
                
                return (
                    <Card key={item.id} className="border-gray-100 shadow-sm overflow-hidden">
                        <CardContent className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {/* Ícone do Tipo */}
                                <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                                    {display.icon}
                                </div>
                                
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-gray-800 text-sm">
                                        {display.title}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {display.subtitle}
                                    </p>
                                    <p className="text-[10px] text-gray-400">
                                        {new Date(item.created_at).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-2">
                                {item.synced === 0 ? (
                                    <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] px-2 h-6">
                                        <RefreshCw size={10} className="animate-spin mr-1" /> Pendente
                                    </Badge>
                                ) : (
                                    <Badge className="bg-green-50 text-green-700 border-green-200 text-[10px] px-2 h-6">
                                        Enviado
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
      </div>

    </div>
  );
};





export default AppHome;