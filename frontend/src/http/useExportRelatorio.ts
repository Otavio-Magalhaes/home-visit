import type { FiltersType } from "@/@types/index.js";
import { api } from "@/lib/api.js";


// Tipagens existentes...
export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  titulo: string;
};


// NOVA FUNÇÃO: Exportar Excel
export const exportDashboard = async (filters: Partial<FiltersType>) => {
  const response = await api.post('/dashboard/export', filters, {
    responseType: 'blob', 
  });
  return response.data;
};