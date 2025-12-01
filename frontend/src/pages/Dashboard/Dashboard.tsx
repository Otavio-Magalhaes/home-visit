import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { GoogleMapComponent } from '../../components/Map/GoogleMap';
import { Flame, MapIcon } from 'lucide-react';
import { useDashboard } from '../../components/layout/DashboardLayout';
import { useDashboardMap } from '../../hooks/useDashboardMap';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import KpiCard from '../../components/KpiCards';

// Tipagem
type MapPin = {
  id: string;
  lat: number;
  lng: number;
  titulo: string;
};

const Dashboard = () => {
  const { filters, setFilters } = useDashboard();
  const { pinos, isLoadingMap } = useDashboardMap(filters);
  const { stats, isLoadingStats } = useDashboardStats(filters);
  const [viewMode, setViewMode] = useState<'markers' | 'heatmap'>('markers');


  const handleMapClick = (lat: number, lng: number) => {
    setFilters((prev: any) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  return (
    <div className="space-y-6">
        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Total Pessoas" value={stats?.resultados?.total_pessoas} loading={isLoadingStats} color="border-blue-500" />
            <KpiCard label="Domicílios" value={stats?.resultados?.total_domicilios} loading={isLoadingStats} color="border-green-500" />
            <KpiCard label="Adultos (+18)" value={stats?.resultados?.qtd_maiores} loading={isLoadingStats} color="border-indigo-500" />
            <KpiCard label="Crianças / Adolescentes (-18)" value={stats?.resultados?.qtd_menores} loading={isLoadingStats} color="border-orange-500" />
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 relative h-[600px] overflow-hidden">
            <div className="absolute top-2.5 right-15 z-10 bg-white/90 backdrop-blur rounded-lg shadow-md p-1 flex gap-1">
                <button 
                    onClick={() => setViewMode('markers')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'markers' ? 'bg-lasalle-blue text-white shadow' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    <MapIcon size={16} /> Pinos
                </button>
                <button 
                    onClick={() => setViewMode('heatmap')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'heatmap' ? 'bg-red-500 text-white shadow' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                    <Flame size={16} /> Calor
                </button>
            </div>

            <GoogleMapComponent 
                pinos={pinos} 
                centerLat={filters.latitude}
                centerLng={filters.longitude}
                radiusMeters={Number(filters.radius_meters)}
                onMapClick={handleMapClick}
                viewMode={viewMode}
            />
        </div>
    </div>
  );
};



export default Dashboard;