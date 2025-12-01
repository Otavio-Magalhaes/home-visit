import type { FiltersType } from "../components/layout/Sidebar";
import { api } from "../lib/api";

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  titulo: string;
};

export const getDashboardMapPins = async (filters: Partial<FiltersType>): Promise<MapPin[]> => {
  const { data } = await api.post<MapPin[]>('/dashboard/map', filters);
  return data;
};