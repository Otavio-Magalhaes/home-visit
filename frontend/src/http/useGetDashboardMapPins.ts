import type { FiltersType } from "@/@types/index.js";
import { api } from "@/libs/api.js";


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