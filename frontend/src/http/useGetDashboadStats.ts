import type { FiltersType } from "../components/layout/Sidebar";
import { api } from "../lib/api";

export type DashboardStats = {
  resultados: {
    total_pessoas: number;
    total_domicilios: number;
    qtd_maiores: number;
    qtd_menores: number;
  };
};

export const getDashboardStats = async (filters: Partial<FiltersType>): Promise<DashboardStats> => {
  const { data } = await api.post('/dashboard/stats', filters);
  return data;
};